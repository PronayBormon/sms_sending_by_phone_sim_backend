import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import Swal from "sweetalert2";

interface Job {
    id: number;
    queue: string;
    attempts: number;
    payload: string;
    available_at: number;
    created_at: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    jobs: {
        data: Job[];
    };
    links: PaginationLink[];
    pagination: {
        from: number;
        to: number;
        total: number;
    };
}

export default function Index({
    jobs,
    links,
    pagination,
}: Props) {
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    const deleteJob = (id: number) => {
        Swal.fire({
            title: "Delete Job?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Delete",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/queues/${id}`);
            }
        });
    };

    return (
        <>
            <Head title="Queue Jobs" />

            <div
                className="main-content-container overflow-hidden"
                style={{ minHeight: "75vh" }}
            >
                <div className="row">
                    <div className="col-md-12">
                        <div className="card bg-white rounded-10 border border-white mb-4">

                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-20">
                                <h4 className="mb-0">
                                    Queue Jobs
                                </h4>
                            </div>

                            <div className="default-table-area mx-minus-1">

                                <div className="table-responsive">

                                    <table className="table align-middle w-100">

                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Queue</th>
                                                <th>Attempts</th>
                                                <th>Available At</th>
                                                <th>Created At</th>
                                                <th className="text-end">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {jobs?.data?.length > 0 ? (

                                                jobs.data.map((job) => (

                                                    <tr key={job.id}>

                                                        <td>
                                                            #{job.id}
                                                        </td>

                                                        <td>
                                                            <span className="badge bg-primary">
                                                                {job.queue}
                                                            </span>
                                                        </td>

                                                        <td>
                                                            {job.attempts}
                                                        </td>

                                                        <td>
                                                            {new Date(
                                                                job.available_at * 1000
                                                            ).toLocaleString()}
                                                        </td>

                                                        <td>
                                                            {new Date(
                                                                job.created_at * 1000
                                                            ).toLocaleString()}
                                                        </td>

                                                        <td>
                                                            <div
                                                                className="d-flex justify-content-end"
                                                                style={{ gap: "10px" }}
                                                            >
                                                                <button
                                                                    className="bg-transparent border-0"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#jobModal"
                                                                    onClick={() =>
                                                                        setSelectedJob(job)
                                                                    }
                                                                >
                                                                    <i className="material-symbols-outlined fs-16">
                                                                        visibility
                                                                    </i>
                                                                </button>

                                                                <button
                                                                    className="bg-transparent border-0 text-danger"
                                                                    onClick={() =>
                                                                        deleteJob(job.id)
                                                                    }
                                                                >
                                                                    <i className="material-symbols-outlined fs-16">
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
                                                        colSpan={6}
                                                        className="text-center py-5"
                                                    >
                                                        No jobs found
                                                    </td>
                                                </tr>

                                            )}

                                        </tbody>

                                    </table>

                                </div>

                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 pt-20 p-20">

                                    <span className="fs-14 text-muted">
                                        Showing {pagination?.from ?? 0} -{" "}
                                        {pagination?.to ?? 0} of{" "}
                                        {pagination?.total ?? 0} jobs
                                    </span>

                                    <ul className="pagination mb-0">

                                        {links?.map((link, index) => (

                                            <li
                                                key={index}
                                                className={`page-item ${
                                                    link.active
                                                        ? "active"
                                                        : ""
                                                } ${
                                                    !link.url
                                                        ? "disabled"
                                                        : ""
                                                }`}
                                            >
                                                <button
                                                    type="button"
                                                    className="page-link"
                                                    disabled={!link.url}
                                                    onClick={() => {
                                                        if (link.url) {
                                                            router.visit(
                                                                link.url,
                                                                {
                                                                    preserveState:
                                                                        true,
                                                                    preserveScroll:
                                                                        true,
                                                                }
                                                            );
                                                        }
                                                    }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            </li>

                                        ))}

                                    </ul>

                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Job Details Modal */}

            <div
                className="modal fade"
                id="jobModal"
                tabIndex={-1}
                aria-hidden="true"
            >
                <div className="modal-dialog modal-xl modal-dialog-scrollable">

                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title">
                                Job Details
                            </h5>

                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                            />
                        </div>

                        <div className="modal-body">

                            {selectedJob && (

                                <>
                                    <div className="mb-3">
                                        <strong>ID:</strong>{" "}
                                        {selectedJob.id}
                                    </div>

                                    <div className="mb-3">
                                        <strong>Queue:</strong>{" "}
                                        {selectedJob.queue}
                                    </div>

                                    <div className="mb-3">
                                        <strong>Attempts:</strong>{" "}
                                        {selectedJob.attempts}
                                    </div>

                                    <div className="mb-3">
                                        <strong>Payload:</strong>

                                        <pre
                                            className="mt-2 p-3 bg-light rounded"
                                            style={{
                                                whiteSpace: "pre-wrap",
                                                wordBreak: "break-word",
                                                maxHeight: "600px",
                                                overflowY: "auto",
                                            }}
                                        >
                                            {JSON.stringify(
                                                JSON.parse(
                                                    selectedJob.payload
                                                ),
                                                null,
                                                2
                                            )}
                                        </pre>
                                    </div>
                                </>

                            )}

                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </>
    );
}