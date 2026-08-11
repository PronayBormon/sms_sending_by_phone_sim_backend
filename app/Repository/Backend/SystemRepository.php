<?php

namespace App\Repository\Backend;

use App\Models\Setting;

class SystemRepository
{
    public function first()
    {
        return Setting::first();
    }

    public function create()
    {
        return Setting::create([]);
    }

    public function update(
        $id,
        array $data
    ) {
        $setting = Setting::findOrFail($id);

        $setting->update($data);

        return $setting;
    }
}
