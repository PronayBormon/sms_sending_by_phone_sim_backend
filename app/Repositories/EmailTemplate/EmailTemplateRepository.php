<?php

namespace App\Repositories\EmailTemplate;

use App\Models\EmailTemplate;

class EmailTemplateRepository
{
    public function getTeamTemplates(int $teamId, int $perPage = 15)
    {
        return EmailTemplate::where('team_id', $teamId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function findById(int $id, int $teamId)
    {
        return EmailTemplate::where('id', $id)
            ->where('team_id', $teamId)
            ->first();
    }

    public function create(array $data)
    {
        return EmailTemplate::create($data);
    }

    public function update(EmailTemplate $template, array $data)
    {
        $template->update($data);
        return $template->fresh();
    }

    public function delete(EmailTemplate $template)
    {
        return $template->delete();
    }
}
