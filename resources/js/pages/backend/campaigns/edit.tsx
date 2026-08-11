import { Head, Link, useForm } from "@inertiajs/react";

interface TeamOption {
    id: number;
    team_name: string;
}

interface TemplateOption {
    id: number;
    title: string;
}

interface SmtpOption {
    id: number;
    host: string;
    username: string;
}

interface ListOption {
    id: number;
    name: string;
}

interface CampaignData {
    id: number;
    team_id: number | null;
    template_id: number | null;
    smtp_id: number | null;
    campaign_name: string | null;
    description: string | null;
    campaign_type: string;
    tags: string[] | string | null;
    recipients_list_ids: number | null;
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
}

interface Props {
    campaign: CampaignData;
    teams?: TeamOption[];
    templates?: TemplateOption[];
    smtps?: SmtpOption[];
    contactLists?: ListOption[];
}

export default function Edit({
    campaign,
    teams = [],
    templates = [],
    smtps = [],
    contactLists = [],
}: Props) {
    const formattedTags = Array.isArray(campaign.tags) ? campaign.tags.join(", ") : campaign.tags || "";

    const { data, setData, put, processing, errors } = useForm({
        team_id: campaign.team_id ? String(campaign.team_id) : "",
        template_id: campaign.template_id ? String(campaign.template_id) : "",
        smtp_id: campaign.smtp_id ? String(campaign.smtp_id) : "",
        campaign_name: campaign.campaign_name || "",
        description: campaign.description || "",
        campaign_type: campaign.campaign_type || "regular",
        tags: formattedTags,
        recipients_list_ids: campaign.recipients_list_ids ? String(campaign.recipients_list_ids) : "",
        from_name: campaign.from_name || "",
        from_email: campaign.from_email || "",
        reply_email: campaign.reply_email || "",
        subject_line: campaign.subject_line || "",
        preview_text: campaign.preview_text || "",
        schedule_type: campaign.schedule_type || "now",
        date: campaign.date || "",
        time: campaign.time || "",
        timezone: campaign.timezone || "UTC",
        is_draft: Boolean(campaign.is_draft),
        is_active: Boolean(campaign.is_active),
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/campaigns/${campaign.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Edit Campaign" />
            <div className="row">
                <div className="col-lg-8">
                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <h3 className="mb-20">Edit Campaign</h3>

                        <form onSubmit={submit}>
                            <div className="row">
                                <div className="col-lg-12 mb-20">
                                    <label className="label fs-16 mb-2">Campaign Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter campaign name"
                                        value={data.campaign_name}
                                        onChange={(e) => setData("campaign_name", e.target.value)}
                                    />
                                    {errors.campaign_name && <div className="text-danger mt-1">{errors.campaign_name}</div>}
                                </div>

                                <div className="col-lg-12 mb-20">
                                    <label className="label fs-16 mb-2">Subject Line</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter email subject line"
                                        value={data.subject_line}
                                        onChange={(e) => setData("subject_line", e.target.value)}
                                    />
                                    {errors.subject_line && <div className="text-danger mt-1">{errors.subject_line}</div>}
                                </div>

                                <div className="col-lg-12 mb-20">
                                    <label className="label fs-16 mb-2">Preview Text</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Snippet shown in email client inbox"
                                        value={data.preview_text}
                                        onChange={(e) => setData("preview_text", e.target.value)}
                                    />
                                    {errors.preview_text && <div className="text-danger mt-1">{errors.preview_text}</div>}
                                </div>

                                <div className="col-lg-6 mb-20">
                                    <label className="label fs-16 mb-2">From Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Sender name"
                                        value={data.from_name}
                                        onChange={(e) => setData("from_name", e.target.value)}
                                    />
                                    {errors.from_name && <div className="text-danger mt-1">{errors.from_name}</div>}
                                </div>

                                <div className="col-lg-6 mb-20">
                                    <label className="label fs-16 mb-2">From Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="sender@example.com"
                                        value={data.from_email}
                                        onChange={(e) => setData("from_email", e.target.value)}
                                    />
                                    {errors.from_email && <div className="text-danger mt-1">{errors.from_email}</div>}
                                </div>

                                <div className="col-lg-12 mb-20">
                                    <label className="label fs-16 mb-2">Reply-To Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="reply@example.com"
                                        value={data.reply_email}
                                        onChange={(e) => setData("reply_email", e.target.value)}
                                    />
                                    {errors.reply_email && <div className="text-danger mt-1">{errors.reply_email}</div>}
                                </div>

                                <div className="col-lg-12 mb-20">
                                    <label className="label fs-16 mb-2">Description</label>
                                    <textarea
                                        className="form-control"
                                        rows={3}
                                        placeholder="Campaign internal notes or description"
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                    />
                                    {errors.description && <div className="text-danger mt-1">{errors.description}</div>}
                                </div>

                                <div className="col-lg-12 mb-20">
                                    <label className="label fs-16 mb-2">Tags (Comma-separated)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. Summer, Sale, Newsletter"
                                        value={data.tags}
                                        onChange={(e) => setData("tags", e.target.value)}
                                    />
                                    {errors.tags && <div className="text-danger mt-1">{errors.tags}</div>}
                                </div>

                                <div className="col-lg-12">
                                    <div className="d-flex gap-2">
                                        <button type="submit" className="btn btn-primary text-white" disabled={processing}>
                                            Update Campaign
                                        </button>
                                        <Link href="/admin/campaigns" className="btn btn-danger text-white">
                                            Cancel
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <h3 className="mb-20">Campaign Setup</h3>

                        <div className="mb-20">
                            <label className="label fs-16 mb-2">Campaign Type</label>
                            <select className="form-select" value={data.campaign_type} onChange={(e) => setData("campaign_type", e.target.value)}>
                                <option value="regular">Regular</option>
                                <option value="automated">Automated</option>
                                <option value="ab_test">A/B Test</option>
                            </select>
                            {errors.campaign_type && <div className="text-danger mt-1">{errors.campaign_type}</div>}
                        </div>

                        <div className="mb-20">
                            <label className="label fs-16 mb-2">Team</label>
                            <select className="form-select" value={data.team_id} onChange={(e) => setData("team_id", e.target.value)}>
                                <option value="">Select Team</option>
                                {teams.map((t) => (
                                    <option key={t.id} value={t.id}>{t.team_name}</option>
                                ))}
                            </select>
                            {errors.team_id && <div className="text-danger mt-1">{errors.team_id}</div>}
                        </div>

                        <div className="mb-20">
                            <label className="label fs-16 mb-2">Email Template</label>
                            <select className="form-select" value={data.template_id} onChange={(e) => setData("template_id", e.target.value)}>
                                <option value="">Select Template</option>
                                {templates.map((tmpl) => (
                                    <option key={tmpl.id} value={tmpl.id}>{tmpl.title}</option>
                                ))}
                            </select>
                            {errors.template_id && <div className="text-danger mt-1">{errors.template_id}</div>}
                        </div>

                        <div className="mb-20">
                            <label className="label fs-16 mb-2">SMTP Server</label>
                            <select className="form-select" value={data.smtp_id} onChange={(e) => setData("smtp_id", e.target.value)}>
                                <option value="">Select SMTP</option>
                                {smtps.map((s) => (
                                    <option key={s.id} value={s.id}>{s.host} ({s.username})</option>
                                ))}
                            </select>
                            {errors.smtp_id && <div className="text-danger mt-1">{errors.smtp_id}</div>}
                        </div>

                        <div className="mb-20">
                            <label className="label fs-16 mb-2">Recipients List</label>
                            <select className="form-select" value={data.recipients_list_ids} onChange={(e) => setData("recipients_list_ids", e.target.value)}>
                                <option value="">Select Contact List</option>
                                {contactLists.map((l) => (
                                    <option key={l.id} value={l.id}>{l.name}</option>
                                ))}
                            </select>
                            {errors.recipients_list_ids && <div className="text-danger mt-1">{errors.recipients_list_ids}</div>}
                        </div>

                        <hr />

                        <h4 className="mb-15 fs-16">Schedule & Status</h4>

                        <div className="mb-20">
                            <label className="label fs-16 mb-2">Schedule Type</label>
                            <select className="form-select" value={data.schedule_type} onChange={(e) => setData("schedule_type", e.target.value)}>
                                <option value="now">Send Immediately (Now)</option>
                                <option value="later">Schedule for Later</option>
                            </select>
                        </div>

                        {data.schedule_type === "later" && (
                            <>
                                <div className="mb-20">
                                    <label className="label fs-16 mb-2">Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={data.date}
                                        onChange={(e) => setData("date", e.target.value)}
                                    />
                                </div>
                                <div className="mb-20">
                                    <label className="label fs-16 mb-2">Time</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        value={data.time}
                                        onChange={(e) => setData("time", e.target.value)}
                                    />
                                </div>
                                <div className="mb-20">
                                    <label className="label fs-16 mb-2">Timezone</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. UTC or America/New_York"
                                        value={data.timezone}
                                        onChange={(e) => setData("timezone", e.target.value)}
                                    />
                                </div>
                            </>
                        )}

                        <div className="form-check mb-2">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="is_draft"
                                checked={data.is_draft}
                                onChange={(e) => setData("is_draft", e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="is_draft">
                                Save as Draft
                            </label>
                        </div>

                        <div className="form-check mb-2">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData("is_active", e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="is_active">
                                Active Campaign
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
