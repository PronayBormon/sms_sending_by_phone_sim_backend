<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeviceSim extends Model
{
    protected $fillable = [
        'team_id', 'device_id', 'slot_number', 'phone_number', 'operator',
        'country_code', 'subscription_id', 'sim_serial_number', 'carrier_name',
        'status', 'is_enabled', 'total_sent', 'total_failed', 'last_used_at',
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
        'last_used_at' => 'datetime',
    ];

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }
}
