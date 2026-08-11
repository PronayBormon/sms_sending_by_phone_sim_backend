<?php

namespace App\Http\Controllers\API\Contact;

use App\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Contact\ContactStoreRequest;
use App\Models\ContactList;
use App\Services\Contact\ContactService;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

class ContactApiController extends Controller
{
    use ApiResponse;

    public $service;
    public $teamid;

    public function __construct(ContactService $service)
    {
        $auth = Auth::user();
        abort_if(!$auth || $auth->teams->isEmpty(), 404, 'Team not found.');
        $this->teamid = $auth->teams->first()->id;
        $this->service = $service;
    }

    public function index(Request $request)
    {
        return $this->respondSafely(fn() => $this->successResponse(
            'Team contact list',
            $this->service->contactlist($this->teamid, $request)
        ));
    }

    public function store(ContactStoreRequest $request): JsonResponse
    {
        return $this->respondSafely(fn() => $this->successResponse(
            'Contact created successfully.',
            $this->service->create($this->teamid, $request->validated()),
            201
        ));
    }

    public function show(int $contact): JsonResponse
    {
        return $this->respondSafely(fn() => $this->successResponse(
            'Contact details',
            $this->service->find($this->teamid, $contact)
        ));
    }

    public function update(Request $request, int $contact): JsonResponse
    {
        $data = $request->validate([
            'name'    => ['sometimes', 'required', 'string', 'max:255'],
            'email'   => ['sometimes', 'required', 'email', 'max:255'],
            'phone'   => ['sometimes', 'required', 'string', 'max:255'],
            'company' => ['sometimes', 'required', 'string', 'max:255'],
            'tags'    => ['sometimes', 'nullable', 'array'],
        ]);

        return $this->respondSafely(fn() => $this->successResponse(
            'Contact updated successfully.',
            $this->service->update($this->teamid, $contact, $data)
        ));
    }

    public function destroy(int $contact): JsonResponse
    {
        return $this->respondSafely(function () use ($contact) {
            $this->service->delete($this->teamid, $contact);

            return $this->successResponse('Contact deleted successfully.');
        });
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        $data = $request->validate([
            'contact_ids'   => ['required', 'array', 'min:1'],
            'contact_ids.*' => ['integer', 'distinct'],
        ]);

        return $this->respondSafely(function () use ($data) {
            $deleted = $this->service->bulkDelete($this->teamid, $data['contact_ids']);

            return $this->successResponse("{$deleted} contact(s) deleted successfully.", ['deleted' => $deleted]);
        });
    }

    public function addToList(Request $request): JsonResponse
    {
        $data = $this->validateListContacts($request);

        return $this->respondSafely(function () use ($data) {
            $count = $this->service->addToList($this->teamid, $data['contact_list_id'], $data['contact_ids']);

            return $this->successResponse("{$count} contact(s) added to the list.", ['added' => $count]);
        });
    }

    public function removeFromList(Request $request): JsonResponse
    {
        $data = $this->validateListContacts($request);

        return $this->respondSafely(function () use ($data) {
            $count = $this->service->removeFromList($this->teamid, $data['contact_list_id'], $data['contact_ids']);

            return $this->successResponse("{$count} contact(s) removed from the list.", ['removed' => $count]);
        });
    }

    public function import(Request $request): JsonResponse
    {
        return $this->respondSafely(function () use ($request) {
            $request->validate(['file' => ['required', 'file', 'mimes:csv,txt,xlsx,xls', 'max:10240']]);

            return $this->successResponse(
                'Contacts imported successfully.',
                $this->service->import($this->teamid, $request->file('file'))
            );
        });
    }

    public function export(): StreamedResponse
    {
        return $this->respondSafely(function () {
            $contacts = $this->service->export($this->teamid);

            return response()->streamDownload(function () use ($contacts) {
                $output = fopen('php://output', 'w');
                fputcsv($output, ['name', 'email', 'phone', 'company', 'tags']);

                foreach ($contacts as $contact) {
                    fputcsv($output, [
                        $contact->name,
                        $contact->email,
                        $contact->phone,
                        $contact->company,
                        implode(',', $contact->tags ?? []),
                    ]);
                }

                fclose($output);
            }, 'contacts.csv', ['Content-Type' => 'text/csv']);
        });
    }

    public function contactList(): JsonResponse
    {
        return $this->respondSafely(function () {
            $recipients = ContactList::where('team_id', $this->teamid)
                ->with('team:id,team_name', 'creator:id,name,email', 'contacts', 'campaigns')
                ->get()
                ->map(function ($list) {
                    $list->contacts = $list->contacts->map(fn($c) => $c->makeHidden('pivot'));

                    return $list;
                });

            return $this->successResponse('Recipients fetched successfully.', $recipients);
        });
    }

    private function validateListContacts(Request $request): array
    {
        return $request->validate([
            'contact_list_id' => ['required', 'integer'],
            'contact_ids'     => ['required', 'array', 'min:1'],
            'contact_ids.*'   => ['integer', 'distinct'],
        ]);
    }

    private function respondSafely(Closure $callback): JsonResponse|StreamedResponse
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
