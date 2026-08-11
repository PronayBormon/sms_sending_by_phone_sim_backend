import { Head, Link, router } from "@inertiajs/react";
import Swal from "sweetalert2";

interface Faq {
    id: number;
    question: string;
    answer: string;
    sort_order: number;
    status: boolean;
}

interface Props {
    faqs: Faq[];
}



export default function Index({ faqs }: Props) {

    const deleteFaq = (id: number) => {
        Swal.fire({
            title: "Delete FAQ?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete FAQ",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/faq/delete/${id}`, {
                    onSuccess: () => {
                        // Swal.fire({
                        //     icon: "success",
                        //     title: "Success",
                        //     text: "FAQ deleted successfully.",
                        //     timer: 1500,
                        //     showConfirmButton: false,
                        // });
                    },

                });

            }
        });
    }

    return (
        <>
            <Head title="FAQs" />

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4 mt-1">
                <div>
                    <h3 className="mb-0">
                        FAQs
                    </h3>
                    <p className="fs-16">
                        Manage frequently asked questions.
                    </p>
                </div>

                <Link href={"/admin/faq/create"} className="text-primary fs-16 text-decoration-none">+ Add new FAQs</Link>

            </div>
            <div className="card bg-white rounded-10 border border-white mb-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 p-20">
                    <h3>
                        Users
                    </h3>

                </div>
                <div className="default-table-area mx-minus-1 table-contact-list">
                    <div className="table-responsive">
                        <table className="table align-middle">
                            <thead>
                                <tr>
                                    <th className="fw-medium pe-0 rtl-pe" scope="col">ID</th>
                                    <th className="fw-medium" scope="col">Question</th>
                                    <th className="fw-medium" scope="col">Order</th>
                                    <th className="fw-medium" scope="col">Status</th>
                                    <th className="fw-medium" scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>

                                {faqs.length > 0 ? (
                                    faqs.map((faq) => (
                                        <tr key={faq.id}>
                                            <td className="text-body pe-0 rtl-pe">{faq.id}</td>
                                            <td className="text-body">{faq.question}</td>
                                            <td className="text-body">{faq.sort_order}</td>
                                            <td className="">
                                                <span className={faq.status
                                                    ? "text-success bg-success bg-opacity-10 fs-15 fw-normal d-inline-block default-badge"
                                                    : "text-danger bg-danger bg-opacity-10 fs-15 fw-normal d-inline-block default-badge"}
                                                >
                                                    {faq.status
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>

                                            </td>
                                            <td className="">
                                                <div className="d-flex justify-content-end" style={{ gap: "12px" }}>
                                                    <Link href={'/admin/faq/edit/' + faq.id} className="bg-transparent p-0 border-0 hover-text-success" data-bs-placement="top" data-bs-title="Edit" data-bs-toggle="tooltip">
                                                        <i className="material-symbols-outlined fs-16 fw-normal text-primary">
                                                            Edit
                                                        </i>
                                                    </Link>
                                                    <button className="bg-transparent p-0 border-0 hover-text-danger"
                                                        onClick={() => deleteFaq(faq.id)}
                                                        data-bs-placement="top" data-bs-title="Delete" data-bs-toggle="tooltip">
                                                        <i className="material-symbols-outlined fs-16 fw-normal text-body">
                                                            delete
                                                        </i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="text-center"
                                        >
                                            No FAQs found
                                        </td>
                                    </tr>
                                )}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="flex-grow-1">
            </div>
        </>
    );
}