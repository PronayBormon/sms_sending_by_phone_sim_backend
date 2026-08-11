import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";

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

interface ContactData {
    id: number;
    name: string | null;
    email: string | null;
}

interface ContactListData {
    id: number;
    name: string | null;
    description: string | null;
    color: string | null;
    team_id: number | null;
    creator_id: number | null;
}

interface Props {
    contactList: ContactListData;
    contacts: ContactData[];
    teams?: TeamOption[];
    users?: UserOption[];
}

export default function Edit({ contactList, contacts = [], teams = [], users = [] }: Props) {
    const { props } = usePage<{ flash?: { success?: string; error?: string } }>();

    const { data, setData, put, processing, errors } = useForm({
        name: contactList.name || "",
        description: contactList.description || "",
        color: contactList.color || "#4f46e5",
        team_id: contactList.team_id ? String(contactList.team_id) : "",
        creator_id: contactList.creator_id ? String(contactList.creator_id) : "",
    });

    const [availableContacts, setAvailableContacts] = useState<ContactData[]>([]);
    const [selectedContactsToAdd, setSelectedContactsToAdd] = useState<number[]>([]);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        if (data.team_id) {
            fetch(`/admin/contact-lists/${contactList.id}/available-contacts?team_id=${data.team_id}&per_page=1000`)
                .then(res => res.json())
                .then(res => {
                    setAvailableContacts(res.data || []);
                    setSelectedContactsToAdd([]);
                });
        } else {
            setAvailableContacts([]);
            setSelectedContactsToAdd([]);
        }
    }, [data.team_id, contactList.id, refreshKey]);

    const handleBulkAdd = () => {
        if (selectedContactsToAdd.length === 0) {
            alert("Please select at least one contact.");
            return;
        }

        router.post(
            `/admin/contact-lists/${contactList.id}/add-contacts`,
            { contact_ids: selectedContactsToAdd },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedContactsToAdd([]);
                    setRefreshKey(prev => prev + 1);
                },
            }
        );
    };

    const toggleContactToAdd = (id: number) => {
        if (selectedContactsToAdd.includes(id)) {
            setSelectedContactsToAdd(selectedContactsToAdd.filter((cId) => cId !== id));
        } else {
            setSelectedContactsToAdd([...selectedContactsToAdd, id]);
        }
    };

    const toggleSelectAllToAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedContactsToAdd(availableContacts.map(c => c.id));
        } else {
            setSelectedContactsToAdd([]);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/contact-lists/${contactList.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Edit Contact List" />
            <div className="row">
                <div className="col-lg-8">
                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <h3 className="mb-20">Edit Contact List</h3>

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
                                            Update List
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

                        <div className="mb-20">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <label className="label fs-14 text-muted mb-0">Existing Contacts</label>
                            </div>
                            <ul className="list-group">
                                {contacts.length > 0 ? contacts.map(contact => (
                                    <li key={contact.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <span>{contact.name || "—"}</span>
                                        <span className="text-muted small">{contact.email || "—"}</span>
                                    </li>
                                )) : <li className="list-group-item text-muted">No contacts found.</li>}
                            </ul>
                        </div>
                    </div>

                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <h3 className="mb-20">Add Team Contacts</h3>
                        {data.team_id ? (
                            availableContacts.length > 0 ? (
                                <div>
                                    <div className="table-responsive" style={{ maxHeight: "300px", overflowY: "auto" }}>
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="sticky-top bg-white">
                                                <tr>
                                                    <th>
                                                        <input 
                                                            type="checkbox" 
                                                            onChange={toggleSelectAllToAdd} 
                                                            checked={selectedContactsToAdd.length === availableContacts.length && availableContacts.length > 0} 
                                                        />
                                                    </th>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {availableContacts.map(c => (
                                                    <tr key={c.id}>
                                                        <td>
                                                            <input 
                                                                type="checkbox" 
                                                                checked={selectedContactsToAdd.includes(c.id)} 
                                                                onChange={() => toggleContactToAdd(c.id)} 
                                                            />
                                                        </td>
                                                        <td>{c.name || "—"}</td>
                                                        <td className="text-muted small">{c.email || "—"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <button 
                                        type="button" 
                                        className="btn btn-success mt-3 w-100" 
                                        onClick={handleBulkAdd}
                                        disabled={selectedContactsToAdd.length === 0}
                                    >
                                        Add Selected Contacts
                                    </button>
                                </div>
                            ) : (
                                <div className="alert alert-info">All contacts from this team are already in the list, or the team has no contacts.</div>
                            )
                        ) : (
                            <div className="alert alert-warning">Please select a team to view available contacts.</div>
                        )}
                        
                        {props?.flash?.success && (
                            <div className="alert alert-success mt-3 mb-0">{props.flash.success}</div>
                        )}
                        {props?.flash?.error && (
                            <div className="alert alert-danger mt-3 mb-0">{props.flash.error}</div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
