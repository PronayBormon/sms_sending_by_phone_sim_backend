<?php

namespace App\Services\Contact;

use App\Repositories\Contact\ContactRepositories;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use PhpOffice\PhpSpreadsheet\IOFactory;

class ContactService
{
    public $repository;
    /**
     * Create a new class instance.
     */
    public function __construct(ContactRepositories $repository)
    {
        $this->repository =  $repository;
    }

    public function contactlist($teamId, $request)
    {
        $query = $this->repository->query($teamId);

        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        return $query->paginate($request->items ?? 10);
    }

    public function create(int $teamId, array $data)
    {
        $exists = $this->repository->existsByEmail($teamId, $data['email']);

        if ($exists) {
            throw ValidationException::withMessages([
                'email' => ['A contact with this email already exists.'],
            ]);
        }

        $data['team_id'] = $teamId;

        return $this->repository->store($data);
    }

    public function find(int $teamId, int $contactId)
    {
        return $this->findOrFail($teamId, $contactId);
    }

    public function update(int $teamId, int $contactId, array $data)
    {
        $contact = $this->findOrFail($teamId, $contactId);

        if ($contact->email != $data['email']) {

            if (isset($data['email']) && $data['email'] !== $contact->email && $this->repository->existsByEmail($teamId, $data['email'])) {
                throw ValidationException::withMessages([
                    'email' => ['A contact with this email already exists.'],
                ]);
            }
        }

        return $this->repository->update($contact, $data);
    }

    public function delete(int $teamId, int $contactId): void
    {
        $this->repository->delete($this->findOrFail($teamId, $contactId));
    }

    public function bulkDelete(int $teamId, array $contactIds): int
    {
        return $this->repository->deleteManyForTeam($teamId, $contactIds);
    }

    public function addToList(int $teamId, int $listId, array $contactIds): int
    {
        $list = $this->findListOrFail($teamId, $listId);
        $contacts = $this->repository->findManyForTeam($teamId, $contactIds);

        if ($contacts->count() !== count(array_unique($contactIds))) {
            throw ValidationException::withMessages([
                'contact_ids' => ['One or more contacts do not belong to this team.'],
            ]);
        }

        $list->contacts()->syncWithoutDetaching($contacts->modelKeys());

        return $contacts->count();
    }

    public function removeFromList(int $teamId, int $listId, array $contactIds): int
    {
        $list = $this->findListOrFail($teamId, $listId);
        $contacts = $this->repository->findManyForTeam($teamId, $contactIds);

        if ($contacts->count() !== count(array_unique($contactIds))) {
            throw ValidationException::withMessages([
                'contact_ids' => ['One or more contacts do not belong to this team.'],
            ]);
        }

        return $list->contacts()->detach($contacts->modelKeys());
    }

    public function import(int $teamId, UploadedFile $file): array
    {
        $extension = strtolower($file->getClientOriginalExtension());
        $requiredHeaders = ['name', 'email', 'phone', 'company'];
        $created = 0;
        $skipped = 0;
        $seenEmails = [];

        if (in_array($extension, ['xlsx', 'xls'])) {
            $spreadsheet = IOFactory::load($file->getRealPath());
            $sheet = $spreadsheet->getActiveSheet();
            $rows = $sheet->toArray(null, true, true, false);

            $rawHeaders = array_shift($rows);

            if (!$rawHeaders) {
                throw ValidationException::withMessages([
                    'file' => ['The file appears to be empty.'],
                ]);
            }

            $headers = array_map(fn($h) => strtolower(trim((string) $h)), $rawHeaders);

            if (array_diff($requiredHeaders, $headers)) {
                throw ValidationException::withMessages([
                    'file' => ['The file must include name, email, phone, and company columns.'],
                ]);
            }

            DB::transaction(function () use ($rows, $headers, $teamId, &$created, &$skipped, &$seenEmails) {
                foreach ($rows as $row) {
                    if (!array_filter($row, fn($v) => trim((string) $v) !== '')) {
                        continue;
                    }

                    $data = array_combine($headers, array_pad(array_slice($row, 0, count($headers)), count($headers), null));
                    $this->processRow($data, $teamId, $created, $skipped, $seenEmails);
                }
            });
        } else {
            // CSV / TXT path
            $handle = fopen($file->getRealPath(), 'r');
            $rawHeaders = $handle ? fgetcsv($handle) : false;

            if (!$rawHeaders) {
                throw ValidationException::withMessages([
                    'file' => ['The file appears to be empty.'],
                ]);
            }

            $headers = array_map(fn($h) => strtolower(trim((string) $h)), $rawHeaders);

            if (array_diff($requiredHeaders, $headers)) {
                throw ValidationException::withMessages([
                    'file' => ['The CSV must include name, email, phone, and company columns.'],
                ]);
            }

            DB::transaction(function () use ($handle, $headers, $teamId, &$created, &$skipped, &$seenEmails) {
                while (($row = fgetcsv($handle)) !== false) {
                    if (!array_filter($row, fn($v) => trim((string) $v) !== '')) {
                        continue;
                    }

                    $data = array_combine($headers, array_pad(array_slice($row, 0, count($headers)), count($headers), null));
                    $this->processRow($data, $teamId, $created, $skipped, $seenEmails);
                }
            });

            fclose($handle);
        }

        return compact('created', 'skipped');
    }

    private function processRow(array $data, int $teamId, int &$created, int &$skipped, array &$seenEmails): void
    {
        $email = strtolower(trim((string) ($data['email'] ?? '')));

        if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL) || isset($seenEmails[$email]) || $this->repository->existsByEmail($teamId, $email)) {
            $skipped++;
            return;
        }

        $seenEmails[$email] = true;
        $tags = array_values(array_filter(array_map('trim', explode(',', (string) ($data['tags'] ?? '')))));

        $this->repository->store([
            'team_id' => $teamId,
            'name'    => trim((string) ($data['name'] ?? '')),
            'email'   => $email,
            'phone'   => trim((string) ($data['phone'] ?? '')),
            'company' => trim((string) ($data['company'] ?? '')),
            'tags'    => $tags ?: null,
        ]);

        $created++;
    }

    public function export(int $teamId)
    {
        return $this->repository->contactsForExport($teamId);
    }

    private function findOrFail(int $teamId, int $contactId)
    {
        $contact = $this->repository->findForTeam($teamId, $contactId);

        if (!$contact) {
            abort(404, 'Contact not found.');
        }

        return $contact;
    }

    private function findListOrFail(int $teamId, int $listId)
    {
        $list = $this->repository->findListForTeam($teamId, $listId);

        if (!$list) {
            abort(404, 'Contact list not found.');
        }

        return $list;
    }
}
