
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import Swal from "sweetalert2";

interface Log {
    [key: string]: any;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    logs: Log[];
    links: PaginationLink[];
    pagination: {
        from: number;
        to: number;
        total: number;
    };
}

export default function Index({
    logs,
    links,
    pagination,
}: Props) {
    const [selectedLog, setSelectedLog] = useState<Log | null>(null);

    const clearLogs = () => {
        Swal.fire({
            title: "Clear Logs?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, clear logs",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete("/admin/logs", {
                    onSuccess: () => {
                        // Swal.fire({
                        //     icon: "success",
                        //     title: "Success",
                        //     text: "Logs cleared successfully.",
                        //     timer: 1500,
                        //     showConfirmButton: false,
                        // });
                    },
                });
            }
        });
    };

    return (
        <>
            <Head title="System Logs" />

            <div
                className="main-content-container overflow-hidden"
                style={{ minHeight: "75vh" }}
            >
                <div className="row">
                    <div className="col-md-12">
                        <div className="card bg-white rounded-10 border border-white mb-4">
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-20">
                                <h4 className="mb-0">System Logs</h4>

                                <button
                                    className="btn btn-danger text-white btn-sm"
                                    onClick={clearLogs}
                                >
                                    Clear Logs
                                </button>
                            </div>

                            <div className="default-table-area mx-minus-1">
                                <div className="table-responsive">
                                    <table className="table align-middle w-100">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Level</th>
                                                <th>Message</th>
                                                <th className="text-end">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {logs?.length > 0 ? (
                                                logs.map(
                                                    (log, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                {log.datetime}
                                                            </td>

                                                            <td>
                                                                <span
                                                                    className={`badge ${log.level?.toLowerCase() ===
                                                                        "error"
                                                                        ? "bg-danger"
                                                                        : log.level?.toLowerCase() ===
                                                                            "warning"
                                                                            ? "bg-warning"
                                                                            : log.level?.toLowerCase() ===
                                                                                "info"
                                                                                ? "bg-info"
                                                                                : "bg-secondary"
                                                                        }`}
                                                                >
                                                                    {log.level}
                                                                </span>
                                                            </td>

                                                            <td
                                                                style={{
                                                                    maxWidth:
                                                                        "700px",
                                                                    whiteSpace:
                                                                        "nowrap",
                                                                    overflow:
                                                                        "hidden",
                                                                    textOverflow:
                                                                        "ellipsis",
                                                                }}
                                                            >
                                                                {log.message}
                                                            </td>

                                                            <td>
                                                                <div className="d-flex justify-content-end">
                                                                    <button
                                                                        className="bg-transparent border-0"
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target="#logModal"
                                                                        onClick={() => {
                                                                            console.log(log);
                                                                            setSelectedLog(log);
                                                                        }}
                                                                    >
                                                                        <i className="material-symbols-outlined fs-16">
                                                                            visibility
                                                                        </i>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={4}
                                                        className="text-center py-5"
                                                    >
                                                        No logs found
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
                                        {pagination?.total ?? 0} logs
                                    </span>

                                    <ul className="pagination mb-0">
                                        {links?.map((link, index) => (
                                            <li
                                                key={index}
                                                className={`page-item ${link.active
                                                    ? "active"
                                                    : ""
                                                    } ${!link.url
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

            {/* View Log Modal */}
            <div
                className="modal fade"
                id="logModal"
                tabIndex={-1}
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Log Details
                            </h5>

                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                            />
                        </div>

                        <div className="modal-body">
                            {selectedLog && (
                                <>
                                    <div className="mb-3">
                                        <strong>Date:</strong> {selectedLog.datetime}
                                    </div>

                                    <div className="mb-3">
                                        <strong>Level:</strong>{" "}
                                        <span
                                            className={`badge bg-${selectedLog.level_class ?? "secondary"}`}
                                        >
                                            {selectedLog.level_name ?? selectedLog.level}
                                        </span>
                                    </div>

                                    <div className="mb-3">
                                        <strong>Message:</strong>

                                        <pre
                                            className="mt-2 p-3 bg-light rounded"
                                            style={{
                                                whiteSpace: "pre-wrap",
                                                wordBreak: "break-word",
                                            }}
                                        >
                                            {selectedLog.message}
                                        </pre>
                                    </div>

                                    {selectedLog.context &&
                                        Object.keys(selectedLog.context).length > 0 && (
                                            <div className="mb-3">
                                                <strong>Context:</strong>

                                                <pre
                                                    className="mt-2 p-3 bg-light rounded"
                                                    style={{
                                                        whiteSpace: "pre-wrap",
                                                        wordBreak: "break-word",
                                                    }}
                                                >
                                                    {JSON.stringify(
                                                        selectedLog.context,
                                                        null,
                                                        2
                                                    )}
                                                </pre>
                                            </div>
                                        )}

                                    {selectedLog.stack_trace && (
                                        <div className="mb-3">
                                            <strong>Stack Trace:</strong>

                                            <pre
                                                className="mt-2 p-3 bg-light rounded"
                                                style={{
                                                    whiteSpace: "pre-wrap",
                                                    wordBreak: "break-word",
                                                    maxHeight: "400px",
                                                    overflowY: "auto",
                                                }}
                                            >
                                                {selectedLog.stack_trace}
                                            </pre>
                                        </div>
                                    )}
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

