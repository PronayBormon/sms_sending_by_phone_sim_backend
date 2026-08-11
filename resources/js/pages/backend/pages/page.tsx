import EditorComponent from "@/pages/widget/editor";
import { Head, router, useForm } from "@inertiajs/react";

interface PageData {
    id: number;
    title: string;
    slug: string;
    content: string;
    status: boolean;
}

interface Props {
    page: PageData;
}

export default function Page({ page }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: page.title || "",
        content: page.content || "",
        status: page.status,
    });

    const submit = (
        e: React.FormEvent
    ) => {
        e.preventDefault();
        router.post('/admin/page/update/' + page.slug, data, {
            onSuccess: () => {
                // reset();
                console.log(data);
            },
        },);

    };

    return (
        <>
            <Head title={page.title} />

            <div className="card bg-white border border-white rounded-10 p-20">
                <div className="mb-20">
                    <h3 className="mb-1 fs-22">
                        {page.title}
                    </h3>

                    <p className="fs-16">
                        Update page content and settings.
                    </p>
                </div>

                <form onSubmit={submit}>
                    <div className="mb-20">
                        <label className="label fs-16 mb-2">
                            Title
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            value={data.title}
                            onChange={(e) =>
                                setData("title", e.target.value)
                            }
                        />

                        {errors.title && (
                            <div className="text-danger mt-1">
                                {errors.title}
                            </div>
                        )}
                    </div>

                    <div className="mb-20">
                        <label className="label fs-16 mb-2">
                            Content
                        </label>

                        <EditorComponent
                            value={
                                data.content
                            }
                            onChange={(value) =>
                                setData(
                                    'content',
                                    value
                                )
                            }
                        />

                        {errors.content && (
                            <div className="text-danger mt-1">
                                {errors.content}
                            </div>
                        )}
                    </div>

                    <div className="mb-20">
                        <div className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="status"
                                checked={data.status}
                                onChange={(e) =>
                                    setData(
                                        "status",
                                        e.target.checked
                                    )
                                }
                            />

                            <label
                                className="form-check-label"
                                htmlFor="status"
                            >
                                Active
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn bg-primary bg-opacity-10 fw-normal fs-16 text-primary"
                        disabled={processing}
                    >
                        Update Page
                    </button>
                </form>
            </div>
        </>
    );
}
