import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import Swal from "sweetalert2";

interface FailedJob {
    id: number;
    uuid: string;
    connection: string;
    queue: string;
    payload: string;
    exception: string;
    failed_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    jobs: {
        data: FailedJob[];
    };
    links: PaginationLink[];
    pagination: {
        from: number;
        to: number;
        total: number;
    };
}

export default function FailedJobs({
    jobs,
    links,
    pagination,
}: Props) {
    const [selectedJob, setSelectedJob] =
        useState<FailedJob | null>(null);

    const retryJob = (id: number) => {
        Swal.fire({
            title: "Retry Job?",
            icon: "question",
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(
                    `/admin/failed-jobs/${id}/retry`
                );
            }
        });
    };

    const deleteJob = (id: number) => {
        Swal.fire({
            title: "Delete Failed Job?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(
                    `/admin/failed-jobs/${id}`
                );
            }
        });
    };

    return (
        <>
            <Head title="Failed Jobs" />


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
                                                <th>Connection</th>
                                                <th>Failed At</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {jobs.data.length > 0 ? (

                                                jobs.data.map((job) => (

                                                    <tr key={job.id}>

                                                        <td>
                                                            #{job.id}
                                                        </td>

                                                        <td>
                                                            {job.queue}
                                                        </td>

                                                        <td>
                                                            {job.connection}
                                                        </td>

                                                        <td>
                                                            {new Date(
                                                                job.failed_at
                                                            ).toLocaleString()}
                                                        </td>

                                                        <td className="text-end">
                                                            <div
                                                                className="d-flex gap-3 justify-content-end"
                                                            >
                                                                <button
                                                                    className="bg-transparent border-0"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#failedJobModal"
                                                                     data-bs-placement="top" data-bs-title="Edit" 
                                                                    //  data-bs-toggle="tooltip"
                                                                    onClick={() =>
                                                                        setSelectedJob(
                                                                            job
                                                                        )
                                                                    }
                                                                >
                                                                    <i className="material-symbols-outlined fs-16">
                                                                            visibility
                                                                        </i>
                                                                </button>

                                                                <button
                                                                    className="bg-transparent border-0"
                                                                    onClick={() =>
                                                                        retryJob(
                                                                            job.id
                                                                        )
                                                                    }
                                                                >
                                                                    
                                                                      <i className="material-symbols-outlined fs-16">
                                                                            restart_alt
                                                                        </i>
                                                                </button>

                                                                <button
                                                                    className="bg-transparent border-0 text-danger"
                                                                    onClick={() =>
                                                                        deleteJob(
                                                                            job.id
                                                                        )
                                                                    }
                                                                >
                                                                      <i className="material-symbols-outlined fs-16">
                                                                            Delete
                                                                        </i>
                                                                </button>
                                                            </div>
                                                        </td>

                                                    </tr>

                                                ))

                                            ) : (

                                                <tr>
                                                    <td
                                                        colSpan={5}
                                                        className="text-center"
                                                    >
                                                        No failed jobs found
                                                    </td>
                                                </tr>

                                            )}

                                        </tbody>

                                    </table>

                                </div>

                                <div className="p-3 d-flex justify-content-between">

                                    <span>
                                        Showing {pagination.from} -
                                        {pagination.to} of{" "}
                                        {pagination.total}
                                    </span>

                                    <ul className="pagination">

                                        {links.map((link, index) => (
                                            <li
                                                key={index}
                                                className={`page-item ${link.active
                                                    ? "active"
                                                    : ""
                                                    }`}
                                            >
                                                <button
                                                    className="page-link"
                                                    disabled={!link.url}
                                                    onClick={() =>
                                                        link.url &&
                                                        router.visit(
                                                            link.url
                                                        )
                                                    }
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

            <div
                className="modal fade"
                id="failedJobModal"
                tabIndex={-1}
            >
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title">
                                Failed Job Details
                            </h5>
                        </div>

                        <div className="modal-body">

                            {selectedJob && (

                                <>
                                    <h6>
                                        Payload
                                    </h6>

                                    <pre
                                        className="bg-light p-3"
                                    >
                                        {JSON.stringify(
                                            JSON.parse(selectedJob.payload),
                                            null,
                                            2
                                        )}
                                    </pre>

                                    <h6>
                                        Exception
                                    </h6>

                                    <pre
                                        className="bg-light p-3"
                                        style={{
                                            maxHeight:
                                                "400px",
                                            overflowY:
                                                "auto",
                                        }}
                                    >
                                        {selectedJob.exception}
                                    </pre>
                                </>

                            )}

                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}