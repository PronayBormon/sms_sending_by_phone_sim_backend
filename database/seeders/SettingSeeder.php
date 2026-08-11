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
                'site_name'         => 'My Website',
                'site_email'        => 'admin@example.com',
                'site_phone'        => '+8801700000000',
                'site_address'      => 'Dhaka, Bangladesh',

                'timezone'          => 'Asia/Dhaka',
                'currency'          => 'BDT',

                'maintenance_mode' => false,

                'light_logo'        => null,
                'dark_logo'         => null,
                'favicon'           => null,

                'meta_title'        => 'My Website',
                'meta_description'  => 'Welcome to My Website.',

                'facebook'          => 'https://facebook.com',
                'twitter'           => 'https://twitter.com',
                'linkedin'          => 'https://linkedin.com',
                'instagram'         => 'https://instagram.com',

                'footer_text'       => 'Welcome to My Website',
                'copyright_text'    => '© ' . now()->year . ' My Website. All rights reserved.',
            ]
        );
    }
}
