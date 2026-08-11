import EditorComponent from "@/pages/widget/editor";
import { Head, useForm } from "@inertiajs/react";


interface Props {
    faq: any
}


export default function Edit({
    faq
}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        question: faq.question ?? "",
        answer: faq.answer ?? "",
        sort_order: faq.sort_order ?? 0,
        status: faq.status ?? true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post("/admin/faq/update/" + faq.id);
    };

    return (
        <>
            <Head title="Edit FAQ" />

            <div className="card bg-white border border-white rounded-10 p-20">
                <div className="mb-20">
                    <h3 className="mb-1 fs-22">
                        Edit FAQ
                    </h3>

                    <p className="fs-16">
                        Add a new frequently asked question.
                    </p>
                </div>

                <form onSubmit={submit}>
                    <div className="mb-20">
                        <label className="label fs-16 mb-2">
                            Question
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            value={data.question}
                            onChange={(e) =>
                                setData("question", e.target.value)
                            }
                        />

                        {errors.question && (
                            <div className="text-danger mt-1">
                                {errors.question}
                            </div>
                        )}
                    </div>

                    <div className="mb-20">
                        <label className="label fs-16 mb-2">
                            Answer
                        </label>
                        <textarea
                            className="form-control"
                            value={data.answer}
                            onChange={(e) =>
                                setData(
                                    "answer",
                                    e.target.value
                                )
                            }></textarea>

                        {errors.answer && (
                            <div className="text-danger mt-1">
                                {errors.answer}
                            </div>
                        )}
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-20">
                                <label className="label fs-16 mb-2">
                                    Sort Order
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    value={data.sort_order}
                                    onChange={(e) =>
                                        setData(
                                            "sort_order",
                                            Number(e.target.value)
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="mb-20">
                                <label className="label fs-16 mb-2">
                                    Status
                                </label>

                                <select
                                    className="form-select"
                                    value={data.status ? "1" : "0"}
                                    onChange={(e) =>
                                        setData(
                                            "status",
                                            e.target.value === "1"
                                        )
                                    }
                                >
                                    <option value="1">
                                        Active
                                    </option>
                                    <option value="0">
                                        Inactive
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary text-white"
                        disabled={processing}
                    >
                        Update FAQ
                    </button>
                </form>
            </div>
        </>
    );
}