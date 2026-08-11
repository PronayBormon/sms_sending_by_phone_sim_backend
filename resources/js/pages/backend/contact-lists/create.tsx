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
        name: "",
        description: "",
        color: "#4f46e5",
        team_id: "",
        creator_id: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/admin/contact-lists", {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Add Contact List" />
            <div className="row">
                <div className="col-lg-8">
                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <h3 className="mb-20">Add Contact List</h3>

                        <form onSubmit={submit}>
                            <div className="row">
                                <div className="col-lg-12 mb-20">
                                    <label className="label fs-16 mb-2">List Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter list name"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                    />
                                    {errors.name && <div className="text-danger mt-1">{errors.name}</div>}
                                </div>

                                <div className="col-lg-12 mb-20">
                                    <label className="label fs-16 mb-2">Description</label>
                                    <textarea
                                        className="form-control"
                                        rows={4}
                                        placeholder="Enter list description"
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                    />
                                    {errors.description && <div className="text-danger mt-1">{errors.description}</div>}
                                </div>

                                <div className="col-lg-12 mb-20">
                                    <label className="label fs-16 mb-2">Label Color</label>
                                    <div className="d-flex align-items-center gap-3">
                                        <input
                                            type="color"
                                            className="form-control form-control-color"
                                            value={data.color}
                                            onChange={(e) => setData("color", e.target.value)}
                                            style={{ width: "60px", height: "42px", padding: "2px" }}
                                        />
                                        <span className="badge px-3 py-2 fs-14" style={{ backgroundColor: data.color }}>
                                            {data.color}
                                        </span>
                                    </div>
                                    {errors.color && <div className="text-danger mt-1">{errors.color}</div>}
                                </div>

                                <div className="col-lg-12">
                                    <div className="d-flex gap-2">
                                        <button type="submit" className="btn btn-primary text-white" disabled={processing}>
                                            Add List
                                        </button>
                                        <Link href="/admin/contact-lists" className="btn btn-danger text-white">
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
                        <h3 className="mb-20">Ownership</h3>

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

                        <div className="mb-20">
                            <label className="label fs-16 mb-2">Creator</label>
                            <select className="form-select" value={data.creator_id} onChange={(e) => setData("creator_id", e.target.value)}>
                                <option value="">Select Creator</option>
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
