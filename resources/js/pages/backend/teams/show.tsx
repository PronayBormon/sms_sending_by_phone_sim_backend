import { Head, Link, router } from "@inertiajs/react";

interface Team {
    id: number;
    team_name: string;
    logo: string | null;
    sender_name: string | null;
    from_mail: string | null;
    email_footer: string | null;
    creator?: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
    } | null;
    members?: {
        id: number;
        user_id: number;
        role: string;
        user: {
            id: number;
            first_name: string;
            last_name: string;
            email: string;
        };
    }[];
    invites?: {
        id: number;
        email: string;
        role: string;
        status: string;
        created_at: string;
    }[];
    created_at: string;
}

interface Props {
    team: Team;
}

export default function Show({ team }: Props) {
    const logoUrl = team.logo ? `/${team.logo}` : "/backend/assets/images/placholder.png";

    return (
        <>
            <Head title={`Team: ${team.team_name}`} />

            <div className="row">
                <div className="col-lg-4">
                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <div className="text-center d-flex flex-column align-items-center">
                            <img
                                src={logoUrl}
                                alt={team.team_name}
                                className="rounded-circle mb-3 border border-1"
                                style={{ width: "120px", height: "120px", objectFit: "cover" }}
                            />
                            <h3 className="mb-1">{team.team_name}</h3>
                            <p className="text-muted mb-0">{team.from_mail || "No email set"}</p>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="mb-0">Team Details</h3>
                            <div className="d-flex gap-2">
                                <Link href={`/admin/teams/${team.id}/edit`} className="btn btn-primary text-white">
                                    Edit
                                </Link>
                                <Link href="/admin/teams" className="btn btn-secondary">
                                    Back
                                </Link>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">Team Name</label>
                                <div className="form-control bg-light">{team.team_name}</div>
                            </div>

                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">Sender Name</label>
                                <div className="form-control bg-light">{team.sender_name || "—"}</div>
                            </div>

                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">From Email Address</label>
                                <div className="form-control bg-light">{team.from_mail || "—"}</div>
                            </div>

                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">Creator</label>
                                <div className="form-control bg-light">
                                    {team.creator ? `${team.creator.first_name} ${team.creator.last_name} (${team.creator.email})` : "—"}
                                </div>
                            </div>

                            <div className="col-md-12 mb-4">
                                <label className="label fs-14 text-muted mb-2">Email Footer</label>
                                <div className="form-control bg-light" style={{ minHeight: "80px", whiteSpace: "pre-wrap" }}>
                                    {team.email_footer || "—"}
                                </div>
                            </div>

                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">Created At</label>
                                <div className="form-control bg-light">
                                    {new Date(team.created_at).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <h3 className="mb-4">Team Members</h3>
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {team.members && team.members.length > 0 ? (
                                        team.members.map((member) => (
                                            <tr key={member.id}>
                                                <td>{member.user ? `${member.user.first_name || ''} ${member.user.last_name || ''}`.trim() : 'Invited User'}</td>
                                                <td>{member.user ? member.user.email : '—'}</td>
                                                <td className="text-capitalize">{member.role}</td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (confirm("Are you sure you want to remove this member?")) {
                                                                 router.delete(`/admin/teams/${team.id}/members/${member.user_id}`);
                                                            }
                                                        }}
                                                        className="btn btn-sm btn-danger text-white"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center text-muted">No members found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <h3 className="mb-4">Pending Invitations</h3>
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                    <tr>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Sent At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {team.invites && team.invites.length > 0 ? (
                                        team.invites.map((invite) => (
                                            <tr key={invite.id}>
                                                <td>{invite.email}</td>
                                                <td className="text-capitalize">{invite.role}</td>
                                                <td>
                                                    <span className={`badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill fs-12 text-capitalize`}>
                                                        {invite.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {new Date(invite.created_at).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center text-muted">No pending invitations found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
