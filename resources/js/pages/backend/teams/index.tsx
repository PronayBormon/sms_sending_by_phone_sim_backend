import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Team {
    id: number;
    team_name: string;
    logo: string | null;
    sender_name: string | null;
    from_mail: string | null;
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

interface TeamsPagination {
    data: Team[];
    links: PaginationLink[];
}

interface Props {
    teams: TeamsPagination;
    filters?: {
        search?: string;
    };
}

export default function Index({ teams, filters }: Props) {
    const [search, setSearch] = useState(filters?.search || "");

    const deleteTeam = (id: number) => {
        Swal.fire({
            title: "Delete Team?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete team",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/teams/${id}`);
            }
        });
    };

    const applyFilters = () => {
        router.get("/admin/teams", { search }, { preserveState: true, replace: true });
    };

    const resetFilters = () => {
        setSearch("");
        router.get("/admin/teams");
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get("/admin/teams", { search }, { preserveState: true, replace: true });
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <>
            <Head title="Teams List" />

            <div className="main-content-container overflow-hidden" style={{ minHeight: "75vh" }}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card bg-white rounded-10 border border-white mb-4">
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-20">
                                <Link className="btn btn-primary text-white" href="/admin/teams/create">
                                    + Add New Team
                                </Link>

                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <input
                                        className="form-control"
                                        placeholder="Search team name or email"
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
                                                <th>Team</th>
                                                <th>Sender Name</th>
                                                <th>From Email</th>
                                                <th>Creator</th>
                                                <th>Created At</th>
                                                <th className="text-end">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {teams.data && teams.data.length > 0 ? (
                                                teams.data.map((team) => (
                                                    <tr key={team.id}>
                                                        <td>#{team.id}</td>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <div className="flex-shrink-0">
                                                                    <img
                                                                        alt="logo"
                                                                        className="rounded-circle"
                                                                        src={team.logo ? `/${team.logo}` : "/backend/assets/images/placholder.png"}
                                                                        style={{ width: "35px", height: "35px", objectFit: "cover" }}
                                                                    />
                                                                </div>
                                                                <div className="flex-grow-1 ms-2">
                                                                    <h4 className="fw-medium fs-16 mb-0">
                                                                        {team.team_name || "Unnamed Team"}
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{team.sender_name || "—"}</td>
                                                        <td>{team.from_mail || "—"}</td>
                                                        <td>
                                                            {team.creator
                                                                ? `${team.creator.first_name || ""} ${team.creator.last_name || ""}`
                                                                : "—"}
                                                        </td>
                                                        <td>
                                                            {new Date(team.created_at).toLocaleDateString("en-US", {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                            })}
                                                        </td>
                                                        <td>
                                                            <div className="d-flex justify-content-end gap-2">
                                                                <Link className="bg-transparent p-0 border-0" href={`/admin/teams/${team.id}`}>
                                                                    <i className="material-symbols-outlined fs-16 text-body">visibility</i>
                                                                </Link>
                                                                <Link className="bg-transparent p-0 border-0" href={`/admin/teams/${team.id}/edit`}>
                                                                    <i className="material-symbols-outlined fs-16 text-primary">edit</i>
                                                                </Link>
                                                                <button onClick={() => deleteTeam(team.id)} className="bg-transparent p-0 border-0">
                                                                    <i className="material-symbols-outlined fs-16 text-danger">delete</i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={7} className="text-center py-5">
                                                        No teams found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-20">
                                    <span className="fs-14 text-muted">Showing {teams.data ? teams.data.length : 0} teams</span>
                                    <ul className="pagination mb-0">
                                        {teams.links?.map((link, index) => (
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
