import { Head, Link, useForm } from "@inertiajs/react";

interface TeamOption {
    id: number;
    team_name: string;
}

interface Props {
    teams?: TeamOption[];
}

export default function Create({ teams = [] }: Props) {
    const { data, setData, post, processing, errors, transform } = useForm({
        team_id: "",
        name: "",
        email: "",
        phone: "",
        company: "",
        tags: "",
    });

    transform((data) => ({
        ...data,
        tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter((t) => t !== "") : [],
    }));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/admin/contacts", {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Add Contact" />
            <div className="row">
                <div className="col-lg-8">
                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <h3 className="mb-20">Add Contact</h3>

                        <form onSubmit={submit}>
                            <div className="row">
                                <div className="col-lg-6 mb-20">
                                    <label className="label fs-16 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter contact full name"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                    />
                                    {errors.name && <div className="text-danger mt-1">{errors.name}</div>}
                                </div>

                                <div className="col-lg-6 mb-20">
                                    <label className="label fs-16 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter email address"
                                        value={data.email}
                                        onChange={(e) => setData("email", e.target.value)}
                                    />
                                    {errors.email && <div className="text-danger mt-1">{errors.email}</div>}
                                </div>

                                <div className="col-lg-6 mb-20">
                                    <label className="label fs-16 mb-2">Phone Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter phone number"
                                        value={data.phone}
                                        onChange={(e) => setData("phone", e.target.value)}
                                    />
                                    {errors.phone && <div className="text-danger mt-1">{errors.phone}</div>}
                                </div>

                                <div className="col-lg-6 mb-20">
                                    <label className="label fs-16 mb-2">Company Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter company name"
                                        value={data.company}
                                        onChange={(e) => setData("company", e.target.value)}
                                    />
                                    {errors.company && <div className="text-danger mt-1">{errors.company}</div>}
                                </div>

                                <div className="col-lg-12 mb-20">
                                    <label className="label fs-16 mb-2">Tags (Comma-separated)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. VIP, Lead, Newsletter"
                                        value={data.tags}
                                        onChange={(e) => setData("tags", e.target.value)}
                                    />
                                    {errors.tags && <div className="text-danger mt-1">{errors.tags}</div>}
                                </div>

                                <div className="col-lg-12">
                                    <div className="d-flex gap-2">
                                        <button type="submit" className="btn btn-primary text-white" disabled={processing}>
                                            Add Contact
                                        </button>
                                        <Link href="/admin/contacts" className="btn btn-danger text-white">
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
                        <h3 className="mb-20">Team Assignment</h3>
                        <div className="mb-20">
                            <label className="label fs-16 mb-2">Assigned Team</label>
                            <select className="form-select" value={data.team_id} onChange={(e) => setData("team_id", e.target.value)}>
                                <option value="">Select Team</option>
                                {teams.map((team) => (
                                    <option key={team.id} value={team.id}>
                                        {team.team_name}
                                    </option>
                                ))}
                            </select>
                            {errors.team_id && <div className="text-danger mt-1">{errors.team_id}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
