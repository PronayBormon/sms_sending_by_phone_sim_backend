import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Contact {
    id: number;
    name: string | null;
    email: string | null;
    phone: string | null;
    company: string | null;
    tags: string[] | null;
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

interface ContactsPagination {
    data: Contact[];
    links: PaginationLink[];
}

interface Props {
    contacts: ContactsPagination;
    filters?: {
        search?: string;
    };
}

export default function Index({ contacts, filters }: Props) {
    const [search, setSearch] = useState(filters?.search || "");

    const deleteContact = (id: number) => {
        Swal.fire({
            title: "Delete Contact?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete contact",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/contacts/${id}`);
            }
        });
    };

    const applyFilters = () => {
        router.get("/admin/contacts", { search }, { preserveState: true, replace: true });
    };

    const resetFilters = () => {
        setSearch("");
        router.get("/admin/contacts");
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get("/admin/contacts", { search }, { preserveState: true, replace: true });
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <>
            <Head title="Contacts List" />

            <div className="main-content-container overflow-hidden" style={{ minHeight: "75vh" }}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card bg-white rounded-10 border border-white mb-4">
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-20">
                                <Link className="btn btn-primary text-white" href="/admin/contacts/create">
                                    + Add New Contact
                                </Link>

                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <input
                                        className="form-control"
                                        placeholder="Search by name, email, or company"
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
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Company</th>
                                                <th>Team</th>
                                                <th>Tags</th>
                                                <th className="text-end">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {contacts.data && contacts.data.length > 0 ? (
                                                contacts.data.map((contact) => (
                                                    <tr key={contact.id}>
                                                        <td>#{contact.id}</td>
                                                        <td>
                                                            <span className="fw-medium text-dark">{contact.name || "—"}</span>
                                                        </td>
                                                        <td>{contact.email || "—"}</td>
                                                        <td>{contact.phone || "—"}</td>
                                                        <td>{contact.company || "—"}</td>
                                                        <td>
                                                            <span className="badge bg-light text-dark">{contact.team?.team_name || "—"}</span>
                                                        </td>
                                                        <td>
                                                            {Array.isArray(contact.tags) && contact.tags.length > 0
                                                                ? contact.tags.map((tag, idx) => (
                                                                      <span key={idx} className="badge bg-info text-white me-1 mb-1">
                                                                          {tag}
                                                                      </span>
                                                                  ))
                                                                : "—"}
                                                        </td>
                                                        <td>
                                                            <div className="d-flex justify-content-end gap-2">
                                                                <Link className="bg-transparent p-0 border-0" href={`/admin/contacts/${contact.id}`}>
                                                                    <i className="material-symbols-outlined fs-16 text-body">visibility</i>
                                                                </Link>
                                                                <Link className="bg-transparent p-0 border-0" href={`/admin/contacts/${contact.id}/edit`}>
                                                                    <i className="material-symbols-outlined fs-16 text-primary">edit</i>
                                                                </Link>
                                                                <button onClick={() => deleteContact(contact.id)} className="bg-transparent p-0 border-0">
                                                                    <i className="material-symbols-outlined fs-16 text-danger">delete</i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={8} className="text-center py-5">
                                                        No contacts found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-20">
                                    <span className="fs-14 text-muted">Showing {contacts.data ? contacts.data.length : 0} contacts</span>
                                    <ul className="pagination mb-0">
                                        {contacts.links?.map((link, index) => (
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
