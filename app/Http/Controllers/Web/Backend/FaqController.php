<?php

namespace App\Http\Controllers\Web\Backend;

use App\Http\Controllers\Controller;
use App\Http\Requests\FAQsStoreRequest;
use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class FaqController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $faqs = Faq::orderBy('sort_order', 'asc')->get();

        return Inertia::render('backend/faqs/index', [
            'faqs' => $faqs,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */

    public function create(Request $request)
    {
        $faqs = Faq::orderBy('sort_order', 'asc')->get();

        return Inertia::render('backend/faqs/create', [
            'faqs' => $faqs,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(FAQsStoreRequest $request)
    {
        $store = Faq::create([
            "question"      => $request->question,
            "answer"        => $request->answer,
            "sort_order"    => $request->sort_order,
            "status"        => $request->status,
        ]);

        return redirect()->route('admin.faq.index')->with('success', 'FAQ store successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $faq = Faq::find($id);

        return Inertia::render('backend/faqs/edit', [
            'faq' => $faq,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $faq = Faq::find($id);

        $faq->update([
            "question"      => $request->question,
            "answer"        => $request->answer,
            "sort_order"    => $request->sort_order,
            "status"        => $request->status,
        ]);

        return redirect()->route('admin.faq.index')->with('success', 'FAQ Update successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $faq = Faq::find($id);

        $faq->delete();

        return redirect()->route('admin.faq.index')->with('success', 'FAQ deleted successfully.');
    }
}
