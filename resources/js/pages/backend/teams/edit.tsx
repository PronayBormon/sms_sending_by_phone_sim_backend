import ImageUpload from "@/pages/widget/image-upload";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import AsyncSelect from "react-select/async";

interface UserOption {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

interface Team {
    id: number;
    team_name: string;
    logo: string | null;
    sender_name: string | null;
    from_mail: string | null;
    email_footer: string | null;
    creator_id: number | null;
    members?: {
        id: number;
        user_id: number;
        role: string;
        user: {
            id: number;
            first_name: string;
            last_name: string;
            email: string;
        };
    }[];
}

interface Props {
    team: Team;
    users?: UserOption[];
}

export default function Edit({ team, users = [] }: Props) {
    const { data, setData, processing, errors } = useForm({
        team_name: team.team_name || "",
        sender_name: team.sender_name || "",
        from_mail: team.from_mail || "",
        email_footer: team.email_footer || "",
        creator_id: team.creator_id ? String(team.creator_id) : "",
        logo: null as File | null,
    });

    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [addProcessing, setAddProcessing] = useState(false);

    const loadOptions = async (inputValue: string) => {
        if (!inputValue) return [];
        try {
            const response = await fetch(`/admin/users/search?q=${inputValue}`);
            const data = await response.json();
            return data.map((user: any) => ({
                value: user.id,
                label: `${user.first_name || ""} ${user.last_name || ""} (${user.email})`
            }));
        } catch (e) {
            return [];
        }
    };

    const handleAddMember = () => {
        if (!selectedUser) return;
        setAddProcessing(true);
        router.post(`/admin/teams/${team.id}/members`, {
            user_id: selectedUser.value,
            role: "viewer"
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedUser(null);
                setAddProcessing(false);
            },
            onError: () => setAddProcessing(false)
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            `/admin/teams/${team.id}`,
            {
                ...data,
                _method: "put",
            },
            {
                forceFormData: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <>
            <Head title="Edit Team" />
            <div className="row">
                <div className="col-lg-8">
                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <h3 className="mb-20">Edit Team</h3>

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
                                    <ImageUpload
                                        label="Team Logo"
                                        file={data.logo}
                                        imageUrl={team.logo ? `/${team.logo}` : undefined}
                                        onChange={(file) => setData("logo", file)}
                                    />
                                    {errors.logo && <div className="text-danger mt-1">{errors.logo}</div>}
                                </div>

                                <div className="col-lg-12">
                                    <div className="d-flex gap-2">
                                        <button type="submit" className="btn btn-primary text-white" disabled={processing}>
                                            Update Team
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

                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <h3 className="mb-20">Manage Team Members</h3>
                        <div className="mb-20">
                            <label className="label fs-16 mb-2">Search User (by Name or Email)</label>
                            <div className="d-flex gap-2">
                                <div className="flex-grow-1">
                                    <AsyncSelect
                                        cacheOptions
                                        loadOptions={loadOptions}
                                        value={selectedUser}
                                        onChange={(option) => setSelectedUser(option)}
                                        placeholder="Search for a user..."
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                minHeight: '45px',
                                                borderColor: '#e2e8f0'
                                            })
                                        }}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-primary text-white"
                                    onClick={handleAddMember}
                                    disabled={!selectedUser || addProcessing}
                                >
                                    Add Member
                                </button>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {team.members && team.members.length > 0 ? (
                                        team.members.map((member) => (
                                            <tr key={member.id}>
                                                <td>{member.user.first_name} {member.user.last_name}</td>
                                                <td>{member.user.email}</td>
                                                <td className="text-capitalize">{member.role}</td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (confirm("Are you sure you want to remove this member?")) {
                                                                router.delete(`/admin/teams/${team.id}/members/${member.user_id}`, { preserveScroll: true });
                                                            }
                                                        }}
                                                        className="btn btn-sm btn-danger text-white"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center text-muted">No members found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
