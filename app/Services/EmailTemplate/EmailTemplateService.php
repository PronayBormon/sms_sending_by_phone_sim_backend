<?php

namespace App\Services\EmailTemplate;

use App\Repositories\EmailTemplate\EmailTemplateRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class EmailTemplateService
{
    public function __construct(
        protected EmailTemplateRepository $repository
    ) {}

    private function getTeamId(): int
    {
        $auth = Auth::user();
        if (!$auth || $auth->teams->isEmpty()) {
            throw ValidationException::withMessages(['team' => 'Team not found.']);
        }
        return $auth->teams->first()->id;
    }

    public function listTemplates(int $perPage = 15)
    {
        return $this->repository->getTeamTemplates($this->getTeamId(), $perPage);
    }

    public function storeTemplate(array $data)
    {
        $settings = $data['settings'] ?? [];
        
        $payload = [
            'team_id' => $this->getTeamId(),
            'creator_id' => Auth::id(),
            'template_type' => 'private',
            'title' => $settings['name'] ?? 'Untitled Template',
            'sub_title' => $settings['subject'] ?? null,
            'design' => $data,
        ];

        return $this->repository->create($payload);
    }

    public function showTemplate(int $id)
    {
        $template = $this->repository->findById($id, $this->getTeamId());

        if (!$template) {
            throw ValidationException::withMessages(['template' => 'Template not found.']);
        }

        return $template;
    }

    public function updateTemplate(int $id, array $data)
    {
        $template = $this->repository->findById($id, $this->getTeamId());

        if (!$template) {
            throw ValidationException::withMessages(['template' => 'Template not found.']);
        }

        $settings = $data['settings'] ?? [];

        $payload = [
            'title' => $settings['name'] ?? $template->title,
            'sub_title' => $settings['subject'] ?? $template->sub_title,
            'design' => $data,
        ];

        return $this->repository->update($template, $payload);
    }

    public function deleteTemplate(int $id)
    {
        $template = $this->repository->findById($id, $this->getTeamId());

        if (!$template) {
            throw ValidationException::withMessages(['template' => 'Template not found.']);
        }

        return $this->repository->delete($template);
    }
}
