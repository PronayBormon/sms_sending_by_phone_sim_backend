import { Head, Link, useForm } from "@inertiajs/react";

interface TeamOption {
    id: number;
    team_name: string;
}

interface Contact {
    id: number;
    name: string | null;
    email: string | null;
    phone: string | null;
    company: string | null;
    tags: string[] | string | null;
    team_id: number | null;
}

interface Props {
    contact: Contact;
    teams?: TeamOption[];
}

export default function Edit({ contact, teams = [] }: Props) {
    const formattedTags = Array.isArray(contact.tags) ? contact.tags.join(", ") : contact.tags || "";

    const { data, setData, put, processing, errors, transform } = useForm({
        team_id: contact.team_id ? String(contact.team_id) : "",
        name: contact.name || "",
        email: contact.email || "",
        phone: contact.phone || "",
        company: contact.company || "",
        tags: formattedTags,
    });

    transform((data) => ({
        ...data,
        tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter((t) => t !== "") : [],
    }));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/contacts/${contact.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Edit Contact" />
            <div className="row">
                <div className="col-lg-8">
                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <h3 className="mb-20">Edit Contact</h3>

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
                                            Update Contact
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
