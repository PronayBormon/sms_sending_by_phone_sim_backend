<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'team_id',
        'template_id',
        'smtp_id',
        'campaign_name',
        'description',
        'campaign_type',
        'tags',
        'recipient_list_ids',
        'status',
        'from_name',
        'from_email',
        'reply_email',
        'subject_line',
        'preview_text',
        'schedule_type',
        'date',
        'time',
        'timezone',
        'is_draft',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'recipient_list_ids' => 'array',
            'is_draft' => 'boolean',
            'is_active' => 'boolean',
            'date' => 'date',
        ];
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'team_id');
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(EmailTemplate::class, 'template_id');
    }

    public function smtp(): BelongsTo
    {
        return $this->belongsTo(Smtp::class, 'smtp_id');
    }

    public function stats()
    {
        return $this->hasOne(CampaignStat::class, 'campaign_id');
    }
}
