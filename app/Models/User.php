<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Team;

// #[Fillable(['name', 'email', 'password'])]
// #[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable, HasApiTokens;

    protected $fillable = [
        'name',
        'first_name',
        'last_name',
        'username',
        'email',
        'password',
        'avatar',
        'role',
        'company_name',
        'job_title',
        'bio',
        'email_verified_at',
        'remember_token',

        "email_notifications",
        "push_notifications",
        "sms_notifications",
        "match_notifications",
        "message_notifications",
        "like_notifications",
        "marketing_notifications",

        'two_factor_type',
        'two_factor_email_code',
        'two_factor_email_code_expires_at',
    ];

    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
        'two_factor_email_code'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'email_notifications' => 'boolean',
            'push_notifications' => 'boolean',
            'sms_notifications' => 'boolean',
            'match_notifications' => 'boolean',
            'message_notifications' => 'boolean',
            'like_notifications' => 'boolean',
            'marketing_notifications' => 'boolean',
            'two_factor_email_code_expires_at' => 'datetime',
        ];
    }

    public function getAvatarAttribute($value)
    {
        if (!$value) {
            return null;
        }
        if (request()->is('api/*')) {
            return asset($value);
        }
        return $value;
    }

    public function createdTeams(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Team::class, 'creator_id');
    }

    public function teamMemberships(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(TeamMember::class, 'user_id');
    }

    public function teams(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'team_members', 'user_id', 'team_id')
            ->withPivot('role')
            ->withTimestamps();
    }
    public function team()
    {
        return $this->hasOne(Team::class, 'creator_id');
    }

    public function contactLists(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ContactList::class, 'creator_id');
    }

    public function currentTeamId()
    {
        // Check if user is a member of a team
        $membership = $this->teamMemberships()->first();
        if ($membership) {
            return $membership->team_id;
        }
        
        // Otherwise check if they created a team
        $team = $this->createdTeams()->first();
        return $team ? $team->id : null;
    }
    /**
     * Get the current team model for the user.
     */
    public function currentTeam()
    {
        $teamId = $this->currentTeamId();
        return $teamId ? \App\Models\Team::find($teamId) : null;
    }



    public function messageTemplates(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(MessageTemplate::class, 'creator_id');
    }
}
