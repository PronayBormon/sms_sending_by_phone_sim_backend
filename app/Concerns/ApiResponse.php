<?php

namespace App\Concerns;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    protected function successResponse(
        string $message = 'Success',
        mixed $data = null,
        int $status = 200
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'code' => $status,
            'message' => $message,
            'data'    => $data,
        ], $status);
    }

    protected function errorResponse(
        string $message = 'Something went wrong',
        int $status = 400,
        mixed $errors = null
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'code' => $status,
            'message' => $message,
            'errors'  => $errors,
        ], $status);
    }
}
