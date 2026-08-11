import { Head, Link, useForm } from "@inertiajs/react";

interface TeamOption {
    id: number;
    team_name: string;
}

interface UserOption {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

interface Props {
    teams?: TeamOption[];
    users?: UserOption[];
}

export default function Create({ teams = [], users = [] }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        team_id: "",
        creator_id: "",
        template_type: "private",
        title: "",
        sub_title: "",
        template: "",
        design: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/admin/email-templates", {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Add Email Template" />
            <div className="row">
                <div className="col-lg-8">
                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <h3 className="mb-20">Add Email Template</h3>

                        <form onSubmit={submit}>
                            <div className="row">
                                <div className="col-lg-12 mb-20">
                                    <label className="label fs-16 mb-2">Template Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter template title"
                                        value={data.title}
                                        onChange={(e) => setData("title", e.target.value)}
                                    />
                                    {errors.title && <div className="text-danger mt-1">{errors.title}</div>}
                                </div>

                                <div className="col-lg-12 mb-20">
                                    <label className="label fs-16 mb-2">Subtitle</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter subtitle (optional)"
                                        value={data.sub_title}
                                        onChange={(e) => setData("sub_title", e.target.value)}
                                    />
                                    {errors.sub_title && <div className="text-danger mt-1">{errors.sub_title}</div>}
                                </div>

                                <div className="col-lg-12 mb-20">
                                    <label className="label fs-16 mb-2">Template HTML</label>
                                    <textarea
                                        className="form-control font-monospace"
                                        rows={10}
                                        placeholder="Paste HTML email template here..."
                                        value={data.template}
                                        onChange={(e) => setData("template", e.target.value)}
                                        style={{ fontSize: "13px" }}
                                    />
                                    {errors.template && <div className="text-danger mt-1">{errors.template}</div>}
                                </div>

                                <div className="col-lg-12 mb-20">
                                    <label className="label fs-16 mb-2">Design JSON</label>
                                    <textarea
                                        className="form-control font-monospace"
                                        rows={5}
                                        placeholder="Paste design JSON (for drag-and-drop builders)..."
                                        value={data.design}
                                        onChange={(e) => setData("design", e.target.value)}
                                        style={{ fontSize: "13px" }}
                                    />
                                    {errors.design && <div className="text-danger mt-1">{errors.design}</div>}
                                </div>

                                <div className="col-lg-12">
                                    <div className="d-flex gap-2">
                                        <button type="submit" className="btn btn-primary text-white" disabled={processing}>
                                            Add Template
                                        </button>
                                        <Link href="/admin/email-templates" className="btn btn-danger text-white">
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
                        <h3 className="mb-20">Settings</h3>

                        <div className="mb-20">
                            <label className="label fs-16 mb-2">Template Type</label>
                            <select className="form-select" value={data.template_type} onChange={(e) => setData("template_type", e.target.value)}>
                                <option value="private">Private</option>
                                <option value="public">Public</option>
                            </select>
                            {errors.template_type && <div className="text-danger mt-1">{errors.template_type}</div>}
                        </div>

                        <div className="mb-20">
                            <label className="label fs-16 mb-2">Assigned Team</label>
                            <select className="form-select" value={data.team_id} onChange={(e) => setData("team_id", e.target.value)}>
                                <option value="">Select Team</option>
                                {teams.map((team) => (
                                    <option key={team.id} value={team.id}>{team.team_name}</option>
                                ))}
                            </select>
                            {errors.team_id && <div className="text-danger mt-1">{errors.team_id}</div>}
                        </div>

                        <div className="mb-20">
                            <label className="label fs-16 mb-2">Creator</label>
                            <select className="form-select" value={data.creator_id} onChange={(e) => setData("creator_id", e.target.value)}>
                                <option value="">Select Creator</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.first_name} {user.last_name}
                                    </option>
                                ))}
                            </select>
                            {errors.creator_id && <div className="text-danger mt-1">{errors.creator_id}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
