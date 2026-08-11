import { Head, Link } from "@inertiajs/react";

interface CampaignData {
    id: number;
    campaign_name: string | null;
    description: string | null;
    campaign_type: string;
    tags: string[] | null;
    from_name: string | null;
    from_email: string | null;
    reply_email: string | null;
    subject_line: string | null;
    preview_text: string | null;
    schedule_type: string;
    date: string | null;
    time: string | null;
    timezone: string | null;
    is_draft: boolean;
    is_active: boolean;
    team?: {
        id: number;
        team_name: string;
    } | null;
    template?: {
        id: number;
        title: string;
    } | null;
    smtp?: {
        id: number;
        host: string;
    } | null;
    recipients_list?: {
        id: number;
        name: string;
    } | null;
    created_at: string;
}

interface Props {
    campaign: CampaignData;
}

export default function Show({ campaign }: Props) {
    return (
        <>
            <Head title={`Campaign: ${campaign.campaign_name}`} />

            <div className="row">
                <div className="col-lg-4">
                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <div className="text-center d-flex flex-column align-items-center mb-4">
                            <div
                                className="rounded-circle mb-3 d-flex align-items-center justify-content-center bg-primary text-white"
                                style={{ width: "90px", height: "90px" }}
                            >
                                <i className="material-symbols-outlined fs-36">campaign</i>
                            </div>
                            <h3 className="mb-1">{campaign.campaign_name || "Unnamed Campaign"}</h3>
                            <span className="badge bg-info text-white text-capitalize mb-2">
                                {campaign.campaign_type ? campaign.campaign_type.replace("_", " ") : "regular"}
                            </span>
                            <div className="d-flex gap-2">
                                {campaign.is_draft ? (
                                    <span className="badge bg-warning text-dark">Draft</span>
                                ) : campaign.is_active ? (
                                    <span className="badge bg-success text-white">Active</span>
                                ) : (
                                    <span className="badge bg-secondary text-white">Inactive</span>
                                )}
                            </div>
                        </div>

                        {Array.isArray(campaign.tags) && campaign.tags.length > 0 && (
                            <div className="mt-3">
                                <label className="label fs-14 text-muted mb-2 d-block">Tags</label>
                                <div className="d-flex flex-wrap gap-1">
                                    {campaign.tags.map((tag, idx) => (
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
                            <h3 className="mb-0">Campaign Details</h3>
                            <div className="d-flex gap-2">
                                <Link href={`/admin/campaigns/${campaign.id}/edit`} className="btn btn-primary text-white">
                                    Edit
                                </Link>
                                <Link href="/admin/campaigns" className="btn btn-secondary">
                                    Back
                                </Link>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">Subject Line</label>
                                <div className="form-control bg-light">{campaign.subject_line || "—"}</div>
                            </div>

                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">Preview Text</label>
                                <div className="form-control bg-light">{campaign.preview_text || "—"}</div>
                            </div>

                            <div className="col-md-4 mb-4">
                                <label className="label fs-14 text-muted mb-2">From Name</label>
                                <div className="form-control bg-light">{campaign.from_name || "—"}</div>
                            </div>

                            <div className="col-md-4 mb-4">
                                <label className="label fs-14 text-muted mb-2">From Email</label>
                                <div className="form-control bg-light">{campaign.from_email || "—"}</div>
                            </div>

                            <div className="col-md-4 mb-4">
                                <label className="label fs-14 text-muted mb-2">Reply Email</label>
                                <div className="form-control bg-light">{campaign.reply_email || "—"}</div>
                            </div>

                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">Assigned Team</label>
                                <div className="form-control bg-light">{campaign.team?.team_name || "—"}</div>
                            </div>

                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">Email Template</label>
                                <div className="form-control bg-light">{campaign.template?.title || "—"}</div>
                            </div>

                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">SMTP Server</label>
                                <div className="form-control bg-light">{campaign.smtp?.host || "—"}</div>
                            </div>

                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">Recipients List</label>
                                <div className="form-control bg-light">{campaign.recipients_list?.name || "—"}</div>
                            </div>

                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">Schedule Type</label>
                                <div className="form-control bg-light text-capitalize">{campaign.schedule_type}</div>
                            </div>

                            {campaign.schedule_type === "later" && (
                                <div className="col-md-6 mb-4">
                                    <label className="label fs-14 text-muted mb-2">Scheduled Date & Time</label>
                                    <div className="form-control bg-light">
                                        {campaign.date || ""} {campaign.time || ""} ({campaign.timezone || "UTC"})
                                    </div>
                                </div>
                            )}

                            <div className="col-md-12 mb-4">
                                <label className="label fs-14 text-muted mb-2">Description</label>
                                <div className="form-control bg-light" style={{ minHeight: "80px", whiteSpace: "pre-wrap" }}>
                                    {campaign.description || "—"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
