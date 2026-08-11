<?php

namespace App\Http\Controllers\Web\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function privacyPolicy(): Response
    {
        $page = Page::where('slug', 'privacy-policy')->first();
        $legacyPage = Page::where('slug', 'privacy-and-policy')->first();

        return $this->renderPage(
            filled($page?->content) ? $page : ($legacyPage ?: $page ?: Page::privacyPolicy())
        );
    }

    public function termsAndConditions(): Response
    {
        return $this->renderPage(Page::termsAndConditions());
    }

    public function logout()
    {
        Auth::logout();
        return redirect()->back();
    }

    private function renderPage(Page $page): Response
    {
        abort_unless($page->status, 404);

        return Inertia::render('frontend/page', [
            'page' => [
                'title' => $page->title,
                'slug' => $page->slug,
                'content' => $page->content,
            ],
        ]);
    }
}
