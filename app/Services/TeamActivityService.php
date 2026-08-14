<?php

namespace App\Services;

use App\Models\TeamActivityLog;

class TeamActivityService
{
    /**
     * Log a team activity.
     *
     * @param  int         $teamId
     * @param  string      $action   e.g. "created a campaign"
     * @param  string|null $subject  e.g. "Summer Sale"
     * @param  string|null $subjectUrl
     * @return void
     */
    public static function log(int $teamId, string $action, ?string $subject = null, ?string $subjectUrl = null): void
    {
        TeamActivityLog::create([
            'team_id'     => $teamId,
            'user_id'     => auth()->id(),
            'action'      => $action,
            'subject'     => $subject,
            'subject_url' => $subjectUrl,
        ]);
    }
}
