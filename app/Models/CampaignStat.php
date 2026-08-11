<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CampaignStat extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'total_recipients',
        'delivered_count',
        'opened_count',
        'clicked_count',
        'bounced_count',
    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class, 'campaign_id');
    }
}
