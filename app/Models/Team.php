<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Team extends Model
{
    use HasFactory;

    protected $fillable = [
        'logo',
        'team_name',
        'sender_name',
        'from_mail',
        'email_footer',
        'creator_id',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function members(): HasMany
    {
        return $this->hasMany(TeamMember::class, 'team_id');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'team_members', 'team_id', 'user_id')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(Contact::class, 'team_id');
    }

    public function contactLists(): HasMany
    {
        return $this->hasMany(ContactList::class, 'team_id');
    }

    public function emailTemplates(): HasMany
    {
        return $this->hasMany(EmailTemplate::class, 'team_id');
    }

    public function smtps(): HasMany
    {
        return $this->hasMany(Smtp::class, 'team_id');
    }

    public function campaigns(): HasMany
    {
        return $this->hasMany(Campaign::class, 'team_id');
    }

    public function activityLogs(): HasMany
    {
        return $this->hasMany(TeamActivityLog::class, 'team_id');
    }
}
