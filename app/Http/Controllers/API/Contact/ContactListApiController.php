<?php

namespace App\Http\Controllers\API\Contact;

use App\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Services\Contact\ContactListService;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

class ContactListApiController extends Controller
{
    use ApiResponse;

    public int $teamid;
    public int $creatorId;

    public function __construct(protected ContactListService $service)
    {
        $auth = Auth::user();
        abort_if(!$auth || $auth->teams->isEmpty(), 404, 'Team not found.');
        $this->teamid    = $auth->teams->first()->id;
        $this->creatorId = $auth->id;
    }

    /**
     * GET /api/v1/contact-list
     * List all contact lists for the team (paginated, searchable).
     */
    public function index(Request $request): JsonResponse
    {
        return $this->respondSafely(fn() => $this->successResponse(
            'Contact lists retrieved successfully.',
            $this->service->list($this->teamid, $request)
        ));
    }

    /**
     * POST /api/v1/contact-list
     * Create a new contact list.
     */
    public function store(Request $request): JsonResponse
    {
        return $this->respondSafely(function () use ($request) {
            $data = $request->validate([
                'name'        => ['required', 'string', 'max:255'],
                'description' => ['nullable', 'string', 'max:1000'],
                'color'       => ['nullable', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'],
            ]);

            return $this->successResponse(
                'Contact list created successfully.',
                $this->service->create($this->teamid, $this->creatorId, $data),
                201
            );
        });
    }

    /**
     * GET /api/v1/contact-list/{id}
     * Show a single contact list with its contacts.
     */
    public function show(int $list): JsonResponse
    {
        return $this->respondSafely(fn() => $this->successResponse(
            'Contact list details.',
            $this->service->find($this->teamid, $list)
        ));
    }

    /**
     * PUT /api/v1/contact-list/{id}
     * Update a contact list.
     */
    public function update(Request $request, int $list): JsonResponse
    {
        return $this->respondSafely(function () use ($request, $list) {
            $data = $request->validate([
                'name'        => ['sometimes', 'required', 'string', 'max:255'],
                'description' => ['sometimes', 'nullable', 'string', 'max:1000'],
                'color'       => ['sometimes', 'nullable', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'],
            ]);

            return $this->successResponse(
                'Contact list updated successfully.',
                $this->service->update($this->teamid, $list, $data)
            );
        });
    }

    /**
     * DELETE /api/v1/contact-list/{id}
     * Delete a contact list.
     */
    public function destroy(int $list): JsonResponse
    {
        return $this->respondSafely(function () use ($list) {
            $this->service->delete($this->teamid, $list);

            return $this->successResponse('Contact list deleted successfully.');
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
