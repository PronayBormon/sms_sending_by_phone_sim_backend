import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Smtp {
    id: number;
    host: string | null;
    port: string | null;
    username: string | null;
    encryption: string | null;
    team?: {
        id: number;
        team_name: string;
    } | null;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface SmtpsPagination {
    data: Smtp[];
    links: PaginationLink[];
}

interface Props {
    smtps: SmtpsPagination;
    filters?: {
        search?: string;
    };
}

export default function Index({ smtps, filters }: Props) {
    const [search, setSearch] = useState(filters?.search || "");

    const deleteSmtp = (id: number) => {
        Swal.fire({
            title: "Delete SMTP?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete SMTP",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/smtps/${id}`);
            }
        });
    };

    const applyFilters = () => {
        router.get("/admin/smtps", { search }, { preserveState: true, replace: true });
    };

    const resetFilters = () => {
        setSearch("");
        router.get("/admin/smtps");
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get("/admin/smtps", { search }, { preserveState: true, replace: true });
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <>
            <Head title="SMTP Configurations" />

            <div className="main-content-container overflow-hidden" style={{ minHeight: "75vh" }}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card bg-white rounded-10 border border-white mb-4">
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-20">
                                <Link className="btn btn-primary text-white" href="/admin/smtps/create">
                                    + Add New SMTP
                                </Link>

                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <input
                                        className="form-control"
                                        placeholder="Search host or username"
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        style={{ width: "250px" }}
                                    />
                                    <button className="btn btn-primary text-white" onClick={applyFilters}>
                                        Filter
                                    </button>
                                    <button className="btn btn-secondary" onClick={resetFilters}>
                                        Reset
                                    </button>
                                </div>
                            </div>

                            <div className="default-table-area mx-minus-1">
                                <div className="table-responsive">
                                    <table className="table align-middle w-100">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Host</th>
                                                <th>Port</th>
                                                <th>Username</th>
                                                <th>Encryption</th>
                                                <th>Team</th>
                                                <th>Created At</th>
                                                <th className="text-end">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {smtps.data && smtps.data.length > 0 ? (
                                                smtps.data.map((smtp) => (
                                                    <tr key={smtp.id}>
                                                        <td>#{smtp.id}</td>
                                                        <td>
                                                            <span className="fw-medium">{smtp.host || "—"}</span>
                                                        </td>
                                                        <td>{smtp.port || "—"}</td>
                                                        <td>{smtp.username || "—"}</td>
                                                        <td>
                                                            <span className="badge bg-secondary">
                                                                {smtp.encryption ? smtp.encryption.toUpperCase() : "NONE"}
                                                            </span>
                                                        </td>
                                                        <td>{smtp.team?.team_name || "—"}</td>
                                                        <td>
                                                            {new Date(smtp.created_at).toLocaleDateString("en-US", {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                            })}
                                                        </td>
                                                        <td>
                                                            <div className="d-flex justify-content-end gap-2">
                                                                <Link className="bg-transparent p-0 border-0" href={`/admin/smtps/${smtp.id}`}>
                                                                    <i className="material-symbols-outlined fs-16 text-body">visibility</i>
                                                                </Link>
                                                                <Link className="bg-transparent p-0 border-0" href={`/admin/smtps/${smtp.id}/edit`}>
                                                                    <i className="material-symbols-outlined fs-16 text-primary">edit</i>
                                                                </Link>
                                                                <button onClick={() => deleteSmtp(smtp.id)} className="bg-transparent p-0 border-0">
                                                                    <i className="material-symbols-outlined fs-16 text-danger">delete</i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={8} className="text-center py-5">
                                                        No SMTP configurations found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-20">
                                    <span className="fs-14 text-muted">Showing {smtps.data ? smtps.data.length : 0} SMTPs</span>
                                    <ul className="pagination mb-0">
                                        {smtps.links?.map((link, index) => (
                                            <li key={index} className={`page-item ${link.active ? "active" : ""} ${!link.url ? "disabled" : ""}`}>
                                                <button
                                                    type="button"
                                                    className="page-link"
                                                    disabled={!link.url}
                                                    onClick={() => link.url && router.visit(link.url, { preserveState: true })}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
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
        </>
    );
}
