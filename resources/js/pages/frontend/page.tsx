import { Head, Link, usePage } from '@inertiajs/react';

type PublicPage = {
    title: string;
    slug: string;
    content: string | null;
};

type Props = {
    page: PublicPage;
};

export default function Page({ page }: Props) {
    const content = page.content?.trim();
        const { setting } = usePage().props as any;

    return (
        <>
            <Head title={page.title} />

            <main className="min-h-screen bg-[#f7f7f2] text-[#1b1b18]">
                <header className="border-b border-black/10 bg-white">
                    <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
                        <Link
                            href="/"
                            className="text-sm font-semibold text-[#1b1b18]"
                        >
                            {setting?.site_name}
                        </Link>

                        <nav className="flex items-center gap-4 text-sm">
                            <Link
                                href="/privacy-policy"
                                className="text-[#4f4e49] hover:text-[#1b1b18]"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/terms-and-conditions"
                                className="text-[#4f4e49] hover:text-[#1b1b18]"
                            >
                                Terms
                            </Link>
                        </nav>
                    </div>
                </header>

                <article className="mx-auto max-w-4xl px-6 py-12">
                    <h1 className="mb-8 text-3xl font-semibold">
                        {page.title}
                    </h1>

                    {content ? (
                        <div
                            className="prose prose-neutral max-w-none"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    ) : (
                        <p className="text-[#706f6c]">
                            Content will be available soon.
                        </p>
                    )}
                </article>
            </main>
        </>
    );
}
