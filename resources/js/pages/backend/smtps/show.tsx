import { Head, Link } from "@inertiajs/react";

interface SmtpData {
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

interface Props {
    smtp: SmtpData;
}

export default function Show({ smtp }: Props) {
    return (
        <>
            <Head title={`SMTP Server #${smtp.id}`} />

            <div className="row">
                <div className="col-lg-4">
                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <div className="text-center d-flex flex-column align-items-center">
                            <div
                                className="rounded-circle mb-3 d-flex align-items-center justify-content-center bg-primary text-white"
                                style={{ width: "90px", height: "90px" }}
                            >
                                <i className="material-symbols-outlined fs-36">dns</i>
                            </div>
                            <h3 className="mb-1">{smtp.host || "No Host"}</h3>
                            <p className="text-muted mb-2">Port {smtp.port || "Default"}</p>
                            <span className="badge bg-secondary mb-2">
                                Encryption: {smtp.encryption ? smtp.encryption.toUpperCase() : "NONE"}
                            </span>
                            {smtp.team && <span className="badge bg-info text-white">{smtp.team.team_name}</span>}
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="mb-0">SMTP Details</h3>
                            <div className="d-flex gap-2">
                                <Link href={`/admin/smtps/${smtp.id}/edit`} className="btn btn-primary text-white">
                                    Edit
                                </Link>
                                <Link href="/admin/smtps" className="btn btn-secondary">
                                    Back
                                </Link>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">Host</label>
                                <div className="form-control bg-light">{smtp.host || "—"}</div>
                            </div>

                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">Port</label>
                                <div className="form-control bg-light">{smtp.port || "—"}</div>
                            </div>

                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">Username</label>
                                <div className="form-control bg-light">{smtp.username || "—"}</div>
                            </div>

                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">Encryption</label>
                                <div className="form-control bg-light">{smtp.encryption || "None"}</div>
                            </div>

                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">Assigned Team</label>
                                <div className="form-control bg-light">{smtp.team?.team_name || "—"}</div>
                            </div>

                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">Created At</label>
                                <div className="form-control bg-light">
                                    {new Date(smtp.created_at).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
