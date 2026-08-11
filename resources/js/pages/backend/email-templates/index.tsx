import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface EmailTemplate {
    id: number;
    title: string | null;
    sub_title: string | null;
    template_type: "private" | "public";
    team?: {
        id: number;
        team_name: string;
    } | null;
    creator?: {
        id: number;
        first_name: string;
        last_name: string;
    } | null;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface EmailTemplatesPagination {
    data: EmailTemplate[];
    links: PaginationLink[];
}

interface Props {
    emailTemplates: EmailTemplatesPagination;
    filters?: {
        search?: string;
    };
}

export default function Index({ emailTemplates, filters }: Props) {
    const [search, setSearch] = useState(filters?.search || "");

    const deleteTemplate = (id: number) => {
        Swal.fire({
            title: "Delete Template?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete template",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/email-templates/${id}`);
            }
        });
    };

    const applyFilters = () => {
        router.get("/admin/email-templates", { search }, { preserveState: true, replace: true });
    };

    const resetFilters = () => {
        setSearch("");
        router.get("/admin/email-templates");
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get("/admin/email-templates", { search }, { preserveState: true, replace: true });
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <>
            <Head title="Email Templates" />

            <div className="main-content-container overflow-hidden" style={{ minHeight: "75vh" }}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card bg-white rounded-10 border border-white mb-4">
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-20">
                                <Link className="btn btn-primary text-white" href="/admin/email-templates/create">
                                    + Add New Template
                                </Link>

                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <input
                                        className="form-control"
                                        placeholder="Search template title"
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
                                                <th>Title</th>
                                                <th>Subtitle</th>
                                                <th>Type</th>
                                                <th>Team</th>
                                                <th>Creator</th>
                                                <th>Created At</th>
                                                <th className="text-end">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {emailTemplates.data && emailTemplates.data.length > 0 ? (
                                                emailTemplates.data.map((template) => (
                                                    <tr key={template.id}>
                                                        <td>#{template.id}</td>
                                                        <td>
                                                            <span className="fw-medium">{template.title || "—"}</span>
                                                        </td>
                                                        <td>{template.sub_title || "—"}</td>
                                                        <td>
                                                            <span
                                                                className={`badge ${
                                                                    template.template_type === "public"
                                                                        ? "bg-success"
                                                                        : "bg-secondary"
                                                                }`}
                                                            >
                                                                {template.template_type}
                                                            </span>
                                                        </td>
                                                        <td>{template.team?.team_name || "—"}</td>
                                                        <td>
                                                            {template.creator
                                                                ? `${template.creator.first_name} ${template.creator.last_name}`
                                                                : "—"}
                                                        </td>
                                                        <td>
                                                            {new Date(template.created_at).toLocaleDateString("en-US", {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                            })}
                                                        </td>
                                                        <td>
                                                            <div className="d-flex justify-content-end gap-2">
                                                                <Link className="bg-transparent p-0 border-0" href={`/admin/email-templates/${template.id}`}>
                                                                    <i className="material-symbols-outlined fs-16 text-body">visibility</i>
                                                                </Link>
                                                                <Link className="bg-transparent p-0 border-0" href={`/admin/email-templates/${template.id}/edit`}>
                                                                    <i className="material-symbols-outlined fs-16 text-primary">edit</i>
                                                                </Link>
                                                                <button onClick={() => deleteTemplate(template.id)} className="bg-transparent p-0 border-0">
                                                                    <i className="material-symbols-outlined fs-16 text-danger">delete</i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={8} className="text-center py-5">
                                                        No email templates found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-20">
                                    <span className="fs-14 text-muted">
                                        Showing {emailTemplates.data ? emailTemplates.data.length : 0} templates
                                    </span>
                                    <ul className="pagination mb-0">
                                        {emailTemplates.links?.map((link, index) => (
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
