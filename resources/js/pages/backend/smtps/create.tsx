import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";

interface TeamOption {
    id: number;
    team_name: string;
}

interface Props {
    teams?: TeamOption[];
}

export default function Create({ teams = [] }: Props) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        team_id: "",
        host: "",
        port: "",
        username: "",
        password: "",
        encryption: "tls",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/admin/smtps", {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Add SMTP Configuration" />
            <div className="row">
                <div className="col-lg-8">
                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <h3 className="mb-20">Add SMTP Server</h3>

                        <form onSubmit={submit}>
                            <div className="row">
                                <div className="col-lg-8 mb-20">
                                    <label className="label fs-16 mb-2">SMTP Host</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. smtp.mailtrap.io or smtp.gmail.com"
                                        value={data.host}
                                        onChange={(e) => setData("host", e.target.value)}
                                    />
                                    {errors.host && <div className="text-danger mt-1">{errors.host}</div>}
                                </div>

                                <div className="col-lg-4 mb-20">
                                    <label className="label fs-16 mb-2">Port</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. 587, 465, 25"
                                        value={data.port}
                                        onChange={(e) => setData("port", e.target.value)}
                                    />
                                    {errors.port && <div className="text-danger mt-1">{errors.port}</div>}
                                </div>

                                <div className="col-lg-6 mb-20">
                                    <label className="label fs-16 mb-2">Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="SMTP Username"
                                        value={data.username}
                                        onChange={(e) => setData("username", e.target.value)}
                                    />
                                    {errors.username && <div className="text-danger mt-1">{errors.username}</div>}
                                </div>

                                <div className="col-lg-6 mb-20">
                                    <label className="label fs-16 mb-2">Password</label>
                                    <div className="position-relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="form-control pe-5"
                                            placeholder="SMTP Password"
                                            value={data.password}
                                            onChange={(e) => setData("password", e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="border-0 bg-transparent position-absolute top-50 end-0 translate-middle-y me-3"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <i className={showPassword ? "ri-eye-line" : "ri-eye-off-line"}></i>
                                        </button>
                                    </div>
                                    {errors.password && <div className="text-danger mt-1">{errors.password}</div>}
                                </div>

                                <div className="col-lg-12">
                                    <div className="d-flex gap-2">
                                        <button type="submit" className="btn btn-primary text-white" disabled={processing}>
                                            Add SMTP
                                        </button>
                                        <Link href="/admin/smtps" className="btn btn-danger text-white">
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
                        <h3 className="mb-20">Configuration Options</h3>

                        <div className="mb-20">
                            <label className="label fs-16 mb-2">Encryption</label>
                            <select className="form-select" value={data.encryption} onChange={(e) => setData("encryption", e.target.value)}>
                                <option value="tls">TLS</option>
                                <option value="ssl">SSL</option>
                                <option value="none">None</option>
                            </select>
                            {errors.encryption && <div className="text-danger mt-1">{errors.encryption}</div>}
                        </div>

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
