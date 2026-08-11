<?php

namespace App\Http\Controllers\Web\Backend;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;


class DynamicPageController extends Controller
{
    public function dynamicPage(string $slug)
    {
        $page = Page::firstOrCreate(
            ['slug' => $slug],
            [
                'title' => Str::title(str_replace('-', ' ', $slug)),
                'content' => '',
                'status' => true,
            ]
        );

        return Inertia::render('backend/pages/page', [
            'page' => $page,
        ]);
    }

    public function updatePage(Request $request, $slug)
    {
        $page = Page::where('slug', $slug)->first();

        $page->update([
            'title' => $request->title,
            // 'slug' => Str::slug($request->title),
            'content' => $request->content,
            'status' => $request->status,
        ]);

        return back()->with('success', 'Page updated successfully.');
    }
}
