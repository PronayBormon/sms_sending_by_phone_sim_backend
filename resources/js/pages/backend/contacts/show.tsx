import { Head, Link } from "@inertiajs/react";

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

interface Props {
    contact: Contact;
}

export default function Show({ contact }: Props) {
    return (
        <>
            <Head title={`Contact: ${contact.name}`} />

            <div className="row">
                <div className="col-lg-4">
                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <div className="text-center d-flex flex-column align-items-center">
                            <div
                                className="rounded-circle mb-3 d-flex align-items-center justify-content-center bg-primary text-white"
                                style={{ width: "100px", height: "100px", fontSize: "32px", fontWeight: 700 }}
                            >
                                {contact.name ? contact.name.charAt(0).toUpperCase() : "?"}
                            </div>
                            <h3 className="mb-1">{contact.name || "Unknown"}</h3>
                            <p className="text-muted mb-2">{contact.email || "No email"}</p>
                            {contact.team && (
                                <span className="badge bg-info text-white">{contact.team.team_name}</span>
                            )}
                        </div>

                        {Array.isArray(contact.tags) && contact.tags.length > 0 && (
                            <div className="mt-4">
                                <label className="label fs-14 text-muted mb-2 d-block">Tags</label>
                                <div className="d-flex flex-wrap gap-1">
                                    {contact.tags.map((tag, idx) => (
                                        <span key={idx} className="badge bg-secondary me-1">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="mb-0">Contact Details</h3>
                            <div className="d-flex gap-2">
                                <Link href={`/admin/contacts/${contact.id}/edit`} className="btn btn-primary text-white">
                                    Edit
                                </Link>
                                <Link href="/admin/contacts" className="btn btn-secondary">
                                    Back
                                </Link>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">Full Name</label>
                                <div className="form-control bg-light">{contact.name || "—"}</div>
                            </div>

                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">Email Address</label>
                                <div className="form-control bg-light">{contact.email || "—"}</div>
                            </div>

                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">Phone Number</label>
                                <div className="form-control bg-light">{contact.phone || "—"}</div>
                            </div>

                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">Company</label>
                                <div className="form-control bg-light">{contact.company || "—"}</div>
                            </div>

                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">Assigned Team</label>
                                <div className="form-control bg-light">{contact.team?.team_name || "—"}</div>
                            </div>

                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">Created At</label>
                                <div className="form-control bg-light">
                                    {new Date(contact.created_at).toLocaleDateString("en-US", {
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
