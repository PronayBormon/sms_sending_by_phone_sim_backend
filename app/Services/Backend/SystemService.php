<?php

namespace App\Services\Backend;

use App\Repository\Backend\SystemRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SystemService
{
    protected $repo;

    public function __construct(
        SystemRepository $repo
    ) {
        $this->repo = $repo;
    }

    public function first()
    {
        return $this->repo->first();
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'site_name' => ['nullable', 'string'],
            'site_email' => ['nullable', 'email'],
            'site_phone' => ['nullable', 'string'],
            'site_address' => ['nullable', 'string'],

            'timezone' => ['nullable', 'string'],
            'currency' => ['nullable', 'string'],

            'maintenance_mode' => [
                'nullable',
                'boolean',
            ],

            'meta_title' => ['nullable', 'string'],
            'meta_description' => [
                'nullable',
                'string',
            ],

            'facebook' => ['nullable', 'string'],
            'twitter' => ['nullable', 'string'],
            'linkedin' => ['nullable', 'string'],
            'instagram' => ['nullable', 'string'],

            'footer_text' => [
                'nullable',
                'string',
            ],

            'copyright_text' => [
                'nullable',
                'string',
            ],

            'light_logo' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp,svg',
                'max:10480',
            ],

            'dark_logo' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp,svg',
                'max:10480',
            ],

            'favicon' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,ico,webp',
                'max:6024',
            ],
        ]);

        $setting = $this->repo->first();

        if (!$setting) {
            $setting = $this->repo->create();
        }

        /*
        |--------------------------------------------------------------------------
        | Light Logo
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('light_logo')) {
            if (
                $setting->light_logo &&
                Storage::disk('public')->exists(
                    $setting->light_logo
                )
            ) {
                Storage::disk('public')->delete(
                    $setting->light_logo
                );
            }

            $validated['light_logo'] = 'storage/' .
                $request
                ->file('light_logo')
                ->store(
                    'settings',
                    'public'
                );
        } else {
            unset($validated['light_logo']);
        }

        /*
        |--------------------------------------------------------------------------
        | Dark Logo
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('dark_logo')) {
            if (
                $setting->dark_logo &&
                Storage::disk('public')->exists(
                    $setting->dark_logo
                )
            ) {
                Storage::disk('public')->delete(
                    $setting->dark_logo
                );
            }

            $validated['dark_logo'] = 'storage/' .
                $request
                ->file('dark_logo')
                ->store(
                    'settings',
                    'public'
                );
        } else {
            unset($validated['dark_logo']);
        }

        /*
        |--------------------------------------------------------------------------
        | Favicon
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('favicon')) {
            if (
                $setting->favicon &&
                Storage::disk('public')->exists(
                    $setting->favicon
                )
            ) {
                Storage::disk('public')->delete(
                    $setting->favicon
                );
            }

            $validated['favicon'] = 'storage/' .
                $request
                ->file('favicon')
                ->store(
                    'settings',
                    'public'
                );
        } else {
            unset($validated['favicon']);
        }

        return $this->repo->update(
            $setting->id,
            $validated
        );
    }
}
