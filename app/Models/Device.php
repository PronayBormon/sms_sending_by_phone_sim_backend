<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Device extends Model
{
    protected $fillable = [
        'team_id',
        'name',
        'device_id',
        'imei',
        'manufacturer',
        'model',
        'android_version',
        'app_version',
        'status',
        'last_seen_at',
        'device_token',
        'is_active',
    ];

    protected $casts = [
        'last_seen_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function sims(): HasMany
    {
        return $this->hasMany(DeviceSim::class);
    }

    public function smsLogs(): HasMany
    {
        return $this->hasMany(SmsLog::class);
    }
}
