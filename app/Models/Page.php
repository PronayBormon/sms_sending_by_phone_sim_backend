<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'content',
        'status',
    ];

    public static function privacyPolicy(): self
    {
        return self::firstOrCreate(
            ['slug' => 'privacy-policy'],
            [
                'title' => 'Privacy Policy',
                'content' => '',
                'status' => true,
            ]
        );
    }

    public static function termsAndConditions(): self
    {
        return self::firstOrCreate(
            ['slug' => 'terms-and-conditions'],
            [
                'title' => 'Terms & Conditions',
                'content' => '',
                'status' => true,
            ]
        );
    }
}
