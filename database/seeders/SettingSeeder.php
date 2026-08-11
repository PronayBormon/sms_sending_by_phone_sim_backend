<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Setting::updateOrCreate(
            ['id' => 1],
            [
                'site_name'         => 'Pink House',
                'site_email'        => 'admin@example.com',
                'site_phone'        => '+8801700000000',
                'site_address'      => 'Dhaka, Bangladesh',

                'timezone'          => 'Asia/Dhaka',
                'currency'          => 'BDT',

                'maintenance_mode' => false,

                'light_logo'        => null,
                'dark_logo'         => null,
                'favicon'           => null,

                'meta_title'        => 'Pink House',
                'meta_description'  => 'Welcome to Pink House.',

                'facebook'          => 'https://facebook.com/pinkhouse',
                'twitter'           => 'https://twitter.com/pinkhouse',
                'linkedin'          => 'https://linkedin.com/pinkhouse',
                'instagram'         => 'https://instagram.com/pinkhouse',

                'footer_text'       => 'Welcome to Pink House',
                'copyright_text'    => now()->year . ' Pink House. All rights reserved.',
            ]
        );
    }
}
