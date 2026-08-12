<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class FirebaseSmsService
{
    public function send(string $deviceToken, array $payload): array
    {
        $credentials = $this->credentials();
        $response = Http::withToken($this->accessToken($credentials))
            ->acceptJson()
            ->post(sprintf(config('firebase.endpoint'), $credentials['project_id']), [
                'message' => [
                    'token' => $deviceToken,
                    'android' => ['priority' => 'high'],
                    'data' => array_map(static fn ($value) => is_scalar($value) ? (string) $value : json_encode($value), $payload),
                ],
            ]);

        if ($response->failed()) {
            throw new RuntimeException($response->json('error.message') ?: $response->body());
        }

        return $response->json() ?? [];
    }

    private function credentials(): array
    {
        $path = config('firebase.service_account_path');
        $isAbsolutePath = str_starts_with($path, DIRECTORY_SEPARATOR)
            || preg_match('#^[A-Za-z]:[\\\\/]#', $path) === 1;
        $path = $isAbsolutePath ? $path : base_path($path);
        if (!is_file($path) || !is_readable($path)) throw new RuntimeException('Firebase service account JSON file is missing or unreadable.');
        $credentials = json_decode(file_get_contents($path), true);
        if (!is_array($credentials) || empty($credentials['project_id']) || empty($credentials['client_email']) || empty($credentials['private_key'])) throw new RuntimeException('Firebase service account JSON is invalid.');
        return $credentials;
    }

    private function accessToken(array $credentials): string
    {
        $key = 'firebase_access_token_' . md5($credentials['client_email']);
        return Cache::remember($key, now()->addMinutes(50), function () use ($credentials) {
            $now = time();
            $header = $this->base64Url(json_encode(['alg' => 'RS256', 'typ' => 'JWT']));
            $claims = $this->base64Url(json_encode([
                'iss' => $credentials['client_email'], 'scope' => 'https://www.googleapis.com/auth/firebase.messaging',
                'aud' => 'https://oauth2.googleapis.com/token', 'iat' => $now, 'exp' => $now + 3600,
            ]));
            $signature = '';
            if (!openssl_sign("{$header}.{$claims}", $signature, $credentials['private_key'], OPENSSL_ALGO_SHA256)) throw new RuntimeException('Unable to sign Firebase service-account JWT.');
            $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
                'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                'assertion' => "{$header}.{$claims}.{$this->base64Url($signature)}",
            ]);
            if ($response->failed() || !$response->json('access_token')) throw new RuntimeException($response->json('error_description') ?: 'Unable to obtain a Firebase access token.');
            return $response->json('access_token');
        });
    }

    private function base64Url(string $value): string
    {
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }
}
