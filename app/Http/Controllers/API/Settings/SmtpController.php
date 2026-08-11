<?php

namespace App\Http\Controllers\API\Settings;

use App\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Smtp;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

class SmtpController extends Controller
{
    use ApiResponse;

    private int $teamId;

    public function __construct()
    {
        $auth = Auth::user();
        abort_if(!$auth || $auth->teams->isEmpty(), 404, 'Team not found.');
        $this->teamId = $auth->teams->first()->id;
    }

    /**
     * GET /api/v1/smtp
     * Get the team's current SMTP configuration (password excluded).
     */
    public function show(): JsonResponse
    {
        return $this->respondSafely(function () {
            $smtp = Smtp::where('team_id', $this->teamId)->first();

            return $this->successResponse('SMTP configuration retrieved.', $smtp);
        });
    }

    /**
     * POST /api/v1/smtp
     * Save (create or update) the SMTP configuration for the team.
     */
    public function save(Request $request): JsonResponse
    {
        return $this->respondSafely(function () use ($request) {
            $data = $request->validate([
                'host'       => ['required', 'string', 'max:255'],
                'port'       => ['required', Rule::in(['25', '465', '587', '2525'])],
                'username'   => ['required', 'string', 'max:255'],
                'password'   => ['nullable', 'string', 'max:500'],
                'encryption' => ['required'],
            ]);

            $smtp = Smtp::where('team_id', $this->teamId)->first();

            if ($smtp) {
                // Only update password if a new one is provided
                if (empty($data['password'])) {
                    unset($data['password']);
                }
                $smtp->update($data);
            } else {
                $data['team_id']  = $this->teamId;
                $data['is_active'] = true;
                $smtp = Smtp::create($data);
            }

            return $this->successResponse('SMTP configuration saved successfully.', $smtp);
        });
    }

    /**
     * POST /api/v1/smtp/test
     * Test the current SMTP connection and store result.
     */
    public function test(): JsonResponse
    {
        return $this->respondSafely(function () {
            $smtp = Smtp::where('team_id', $this->teamId)->first();

            if (!$smtp) {
                abort(422, 'No SMTP configuration found. Please save your configuration first.');
            }

            $start = microtime(true);
            $passed = false;
            $error  = null;

            try {
                $connection = @fsockopen(
                    $smtp->host,
                    (int) $smtp->port,
                    $errno,
                    $errstr,
                    10
                );

                if ($connection) {
                    fclose($connection);
                    $passed = true;
                } else {
                    $error = $errstr ?: "Could not connect to {$smtp->host}:{$smtp->port}";
                }
            } catch (Throwable $e) {
                $error = $e->getMessage();
            }

            $responseMs = (int) round((microtime(true) - $start) * 1000);

            $smtp->update([
                'last_tested_at'        => now(),
                'last_test_response_ms' => $responseMs,
                'last_test_passed'      => $passed,
                'last_test_error'       => $error,
            ]);

            return $this->successResponse(
                $passed ? 'Connection successful.' : 'Connection failed.',
                [
                    'passed'      => $passed,
                    'response_ms' => $responseMs,
                    'tested_at'   => $smtp->last_tested_at,
                    'error'       => $error,
                ]
            );
        });
    }

    /**
     * DELETE /api/v1/smtp
     * Remove the SMTP configuration for the team.
     */
    public function destroy(): JsonResponse
    {
        return $this->respondSafely(function () {
            $smtp = Smtp::where('team_id', $this->teamId)->first();

            if ($smtp) {
                $smtp->delete();
            }

            return $this->successResponse('SMTP configuration removed.');
        });
    }

    private function respondSafely(Closure $callback): JsonResponse
    {
        try {
            return $callback();
        } catch (ValidationException $e) {
            return $this->errorResponse('Validation failed.', 422, $e->errors());
        } catch (HttpExceptionInterface $e) {
            return $this->errorResponse($e->getMessage() ?: 'Request failed.', $e->getStatusCode());
        } catch (Throwable $e) {
            report($e);

            return $this->errorResponse('Something went wrong. Please try again later.', 500);
        }
    }
}
