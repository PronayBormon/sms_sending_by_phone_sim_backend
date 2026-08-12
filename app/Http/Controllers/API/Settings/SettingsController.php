<?php

namespace App\Http\Controllers\API\Settings;

use App\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\Page;
use App\Models\Setting;
use GuzzleHttp\Psr7\Request;

class SettingsController extends Controller
{
    use ApiResponse;

    public function systemSetting()
    {
        $data = Setting::firstOrCreate(
            ['id' => 1],
            [
                'site_name' => null,
                'site_email' => null,
                'site_phone' => null,
                'site_address' => null,
                'timezone' => null,
                'currency' => null,
                'maintenance_mode' => false,
                'light_logo' => null,
                'dark_logo' => null,
                'favicon' => null,
                'meta_title' => null,
                'meta_description' => null,
                'facebook' => null,
                'twitter' => null,
                'linkedin' => null,
                'instagram' => null,
                'footer_text' => null,
                'copyright_text' => null,
            ]
        );

        return $this->successResponse(
            'System settings',
            $data,
            200
        );
    }

    public function faqList()
    {
        $faqs = Faq::orderby('sort_order', 'asc')->get();

        // dd($faqs);

        return $this->successResponse(
            'FAQs list',
            $faqs,
            200
        );
    }

    public function dynamicPage($slug)
    {
        $page = Page::where('slug', $slug)->first();

        return $this->successResponse(
            $page->title ?? $slug,
            $page,
            200
        );
    }
}
