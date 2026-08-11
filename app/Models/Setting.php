<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'site_name',
        'site_email',
        'site_phone',
        'site_address',

        'timezone',
        'currency',

        'maintenance_mode',

        'light_logo',
        'dark_logo',

        'favicon',

        'meta_title',
        'meta_description',

        'facebook',
        'twitter',
        'linkedin',
        'instagram',

        'footer_text',
        'copyright_text',
    ];

    protected $casts = [
        'maintenance_mode' => 'boolean',
    ];
}
