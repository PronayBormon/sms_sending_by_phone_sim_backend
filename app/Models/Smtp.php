<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Smtp extends Model
{
    use HasFactory;

    protected $fillable = [
        'team_id',
        'host',
        'port',
        'username',
        'password',
        'encryption',
        'is_active',
        'last_tested_at',
        'last_test_response_ms',
        'last_test_passed',
        'last_test_error',
    ];

    protected $hidden = ['password'];

    protected $casts = [
        'is_active'        => 'boolean',
        'last_tested_at'   => 'datetime',
        'last_test_passed' => 'boolean',
    ];

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'team_id');
    }

    public function campaigns(): HasMany
    {
        return $this->hasMany(Campaign::class, 'smtp_id');
    }
}
