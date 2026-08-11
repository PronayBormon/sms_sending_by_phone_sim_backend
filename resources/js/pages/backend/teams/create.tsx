import ImageUpload from "@/pages/widget/image-upload";
import { Head, Link, useForm } from "@inertiajs/react";

interface UserOption {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

interface Props {
    users?: UserOption[];
}

export default function Create({ users = [] }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        team_name: "",
        sender_name: "",
        from_mail: "",
        email_footer: "",
        creator_id: "",
        logo: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/admin/teams", {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Add Team" />
            <div className="row">
                <div className="col-lg-8">
                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <h3 className="mb-20">Add Team</h3>

                        <form onSubmit={submit}>
                            <div className="row">
                                <div className="col-lg-12 mb-20">
                                    <label className="label fs-16 mb-2">Team Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter team name"
                                        value={data.team_name}
                                        onChange={(e) => setData("team_name", e.target.value)}
                                    />
                                    {errors.team_name && <div className="text-danger mt-1">{errors.team_name}</div>}
                                </div>

                                <div className="col-lg-6 mb-20">
                                    <label className="label fs-16 mb-2">Sender Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter sender name"
                                        value={data.sender_name}
                                        onChange={(e) => setData("sender_name", e.target.value)}
                                    />
                                    {errors.sender_name && <div className="text-danger mt-1">{errors.sender_name}</div>}
                                </div>

                                <div className="col-lg-6 mb-20">
                                    <label className="label fs-16 mb-2">From Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter from email"
                                        value={data.from_mail}
                                        onChange={(e) => setData("from_mail", e.target.value)}
                                    />
                                    {errors.from_mail && <div className="text-danger mt-1">{errors.from_mail}</div>}
                                </div>

                                <div className="col-lg-12 mb-20">
                                    <label className="label fs-16 mb-2">Email Footer</label>
                                    <textarea
                                        className="form-control"
                                        rows={4}
                                        placeholder="Enter default email footer text or HTML"
                                        value={data.email_footer}
                                        onChange={(e) => setData("email_footer", e.target.value)}
                                    />
                                    {errors.email_footer && <div className="text-danger mt-1">{errors.email_footer}</div>}
                                </div>

                                <div className="col-lg-12 mb-20">
                                    <ImageUpload label="Team Logo" file={data.logo} onChange={(file) => setData("logo", file)} />
                                    {errors.logo && <div className="text-danger mt-1">{errors.logo}</div>}
                                </div>

                                <div className="col-lg-12">
                                    <div className="d-flex gap-2">
                                        <button type="submit" className="btn btn-primary text-white" disabled={processing}>
                                            Add Team
                                        </button>
                                        <Link href="/admin/teams" className="btn btn-danger text-white">
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
                        <h3 className="mb-20">Settings & Ownership</h3>
                        <div className="mb-20">
                            <label className="label fs-16 mb-2">Team Creator</label>
                            <select className="form-select" value={data.creator_id} onChange={(e) => setData("creator_id", e.target.value)}>
                                <option value="">Select Creator User</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.first_name} {user.last_name} ({user.email})
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
