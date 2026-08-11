import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface ContactList {
    id: number;
    name: string | null;
    description: string | null;
    color: string | null;
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

interface ContactListsPagination {
    data: ContactList[];
    links: PaginationLink[];
}

interface Props {
    contactLists: ContactListsPagination;
    filters?: {
        search?: string;
    };
}

export default function Index({ contactLists, filters }: Props) {
    const [search, setSearch] = useState(filters?.search || "");

    const deleteList = (id: number) => {
        Swal.fire({
            title: "Delete Contact List?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete list",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/contact-lists/${id}`);
            }
        });
    };

    const applyFilters = () => {
        router.get("/admin/contact-lists", { search }, { preserveState: true, replace: true });
    };

    const resetFilters = () => {
        setSearch("");
        router.get("/admin/contact-lists");
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get("/admin/contact-lists", { search }, { preserveState: true, replace: true });
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <>
            <Head title="Contact Lists" />

            <div className="main-content-container overflow-hidden" style={{ minHeight: "75vh" }}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card bg-white rounded-10 border border-white mb-4">
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-20">
                                <Link className="btn btn-primary text-white" href="/admin/contact-lists/create">
                                    + Add New List
                                </Link>

                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <input
                                        className="form-control"
                                        placeholder="Search list name"
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
                                                <th>Color</th>
                                                <th>Team</th>
                                                <th>Creator</th>
                                                <th>Created At</th>
                                                <th className="text-end">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {contactLists.data && contactLists.data.length > 0 ? (
                                                contactLists.data.map((list) => (
                                                    <tr key={list.id}>
                                                        <td>#{list.id}</td>
                                                        <td>
                                                            <div className="d-flex align-items-center gap-2">
                                                                {list.color && (
                                                                    <span
                                                                        className="rounded-circle d-inline-block flex-shrink-0"
                                                                        style={{
                                                                            width: "12px",
                                                                            height: "12px",
                                                                            backgroundColor: list.color,
                                                                        }}
                                                                    />
                                                                )}
                                                                <span className="fw-medium">{list.name || "—"}</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {list.color ? (
                                                                <span className="badge" style={{ backgroundColor: list.color }}>
                                                                    {list.color}
                                                                </span>
                                                            ) : (
                                                                "—"
                                                            )}
                                                        </td>
                                                        <td>{list.team?.team_name || "—"}</td>
                                                        <td>
                                                            {list.creator
                                                                ? `${list.creator.first_name} ${list.creator.last_name}`
                                                                : "—"}
                                                        </td>
                                                        <td>
                                                            {new Date(list.created_at).toLocaleDateString("en-US", {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                            })}
                                                        </td>
                                                        <td>
                                                            <div className="d-flex justify-content-end gap-2">
                                                                <Link className="bg-transparent p-0 border-0" href={`/admin/contact-lists/${list.id}`}>
                                                                    <i className="material-symbols-outlined fs-16 text-body">visibility</i>
                                                                </Link>
                                                                <Link className="bg-transparent p-0 border-0" href={`/admin/contact-lists/${list.id}/edit`}>
                                                                    <i className="material-symbols-outlined fs-16 text-primary">edit</i>
                                                                </Link>
                                                                <button onClick={() => deleteList(list.id)} className="bg-transparent p-0 border-0">
                                                                    <i className="material-symbols-outlined fs-16 text-danger">delete</i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={7} className="text-center py-5">
                                                        No contact lists found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-20">
                                    <span className="fs-14 text-muted">Showing {contactLists.data ? contactLists.data.length : 0} lists</span>
                                    <ul className="pagination mb-0">
                                        {contactLists.links?.map((link, index) => (
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
