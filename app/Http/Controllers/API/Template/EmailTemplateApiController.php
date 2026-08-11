<?php

namespace App\Http\Controllers\API\Template;

use App\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Services\EmailTemplate\EmailTemplateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

class EmailTemplateApiController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected EmailTemplateService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        return $this->respondSafely(function () use ($request) {
            $perPage = $request->input('per_page', 15);
            $templates = $this->service->listTemplates($perPage);

            return $this->successResponse('Templates retrieved successfully.', $templates);
        });
    }

    public function store(Request $request): JsonResponse
    {
        // dd($request->all());
        return $this->respondSafely(function () use ($request) {
            $data = $request->validate([
                'settings' => ['required', 'array'],
                'blocks' => ['required', 'array'],
                'metadata' => ['required', 'array'],
            ]);

            $template = $this->service->storeTemplate($data);

            return $this->successResponse('Template saved successfully.', $template, 201);
        });
    }

    public function show($id): JsonResponse
    {
        return $this->respondSafely(function () use ($id) {
            $template = $this->service->showTemplate($id);

            return $this->successResponse('Template retrieved successfully.', $template);
        });
    }

    public function update(Request $request, $id): JsonResponse
    {
        return $this->respondSafely(function () use ($request, $id) {
            $data = $request->validate([
                'settings' => ['sometimes', 'array'],
                'blocks' => ['sometimes', 'array'],
                'metadata' => ['sometimes', 'array'],
            ]);

            $template = $this->service->updateTemplate($id, $data);

            return $this->successResponse('Template updated successfully.', $template);
        });
    }

    public function destroy($id): JsonResponse
    {
        return $this->respondSafely(function () use ($id) {
            $this->service->deleteTemplate($id);

            return $this->successResponse('Template deleted successfully.');
        });
    }

    private function respondSafely(\Closure $callback): JsonResponse
    {
        try {
            return $callback();
        } catch (ValidationException $e) {
            return $this->errorResponse($e->getMessage(), 422, $e->errors());
        } catch (HttpExceptionInterface $e) {
            return $this->errorResponse($e->getMessage() ?: 'Request failed.', $e->getStatusCode());
        } catch (Throwable $e) {
            report($e);
            return $this->errorResponse('Something went wrong. Please try again later.', 500);
        }
    }
}
