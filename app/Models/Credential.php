<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Credential extends Model
{
    protected $fillable = [
        'provider',
        'key',
        'value',
    ];

    public static function getValue(string $provider, string $key, $default = null)
    {
        $credential = static::firstOrCreate(
            [
                'provider' => $provider,
                'key' => $key,
            ],
            [
                'value' => null,
            ]
        );

        return filled($credential->value) ? $credential->value : $default;
    }

    public static function setValue(string $provider, string $key, $value)
    {
        return static::updateOrCreate(
            [
                'provider' => $provider,
                'key' => $key,
            ],
            [
                'value' => $value,
            ]
        );
    }

    public static function smtp(string $key)
    {
        $defaults = [
            'mailer' => config('mail.default'),
            'host' => config('mail.mailers.smtp.host'),
            'port' => config('mail.mailers.smtp.port'),
            'username' => config('mail.mailers.smtp.username'),
            'password' => config('mail.mailers.smtp.password'),
            'encryption' => config('mail.mailers.smtp.scheme') ?? config('mail.mailers.smtp.encryption'),
            'from_email' => config('mail.from.address'),
            'from_name' => config('mail.from.name'),
        ];

        return static::getValue(
            'smtp',
            $key,
            $defaults[$key] ?? null
        );
    }
}
