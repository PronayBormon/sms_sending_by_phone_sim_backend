import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState, useCallback } from "react";
import AsyncSelect from "react-select/async";

interface ContactListData {
    id: number;
    name: string | null;
    description: string | null;
    color: string | null;
    team?: {
        id: number;
        team_name: string;
    } | null;
    creator?: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
    } | null;
    created_at: string;
}

interface ContactData {
    id: number;
    name: string | null;
    email: string | null;
}

interface ContactOption {
    value: number;
    label: string;
}

interface Props {
    contactList: ContactListData;
    contacts: ContactData[];
}

export default function Show({ contactList, contacts }: Props) {
    const { props } = usePage<{ flash?: { success?: string; error?: string } }>();
    const [selectedContacts, setSelectedContacts] = useState<ContactOption[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedRemoveContacts, setSelectedRemoveContacts] = useState<number[]>([]);

    // Async loader for react-select — searches contacts by email/name
    const loadContacts = useCallback(
        (inputValue: string): Promise<ContactOption[]> => {
            return fetch(`/admin/contact-lists/${contactList.id}/available-contacts?q=${encodeURIComponent(inputValue)}`)
                .then((res) => res.json())
                .then((data) =>
                    data.data.map((c: any) => ({
                        value: c.id,
                        label: `${c.email}${c.name ? ` (${c.name})` : ""}`,
                    }))
                );
        },
        [contactList.id]
    );

    const handleBulkAdd = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const ids = selectedContacts.map((c) => c.value);

        if (ids.length === 0) {
            alert("Please select at least one contact.");
            return;
        }

        router.post(
            `/admin/contact-lists/${contactList.id}/add-contacts`,
            { contact_ids: ids },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedContacts([]);
                    setShowModal(false);
                },
            }
        );
    };

    const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedRemoveContacts(contacts.map((c) => c.id));
        } else {
            setSelectedRemoveContacts([]);
        }
    };

    const toggleContact = (id: number) => {
        if (selectedRemoveContacts.includes(id)) {
            setSelectedRemoveContacts(selectedRemoveContacts.filter((cId) => cId !== id));
        } else {
            setSelectedRemoveContacts([...selectedRemoveContacts, id]);
        }
    };

    const handleBulkRemove = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (selectedRemoveContacts.length === 0) return;

        import("sweetalert2").then(({ default: Swal }) => {
            Swal.fire({
                title: 'Are you sure?',
                text: "You are about to remove selected contacts from this list.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, remove them!'
            }).then((result) => {
                if (result.isConfirmed) {
                    router.post(
                        `/admin/contact-lists/${contactList.id}/remove-contacts`,
                        { contact_ids: selectedRemoveContacts },
                        {
                            preserveScroll: true,
                            onSuccess: () => {
                                setSelectedRemoveContacts([]);
                            },
                        }
                    );
                }
            });
        });
    };

    return (
        <>
            <Head title={`Contact List: ${contactList.name}`} />

            <div className="row">
                <div className="col-lg-4">
                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <div className="text-center d-flex flex-column align-items-center">
                            <div
                                className="rounded-circle mb-3 d-flex align-items-center justify-content-center text-white"
                                style={{
                                    width: "90px",
                                    height: "90px",
                                    fontSize: "32px",
                                    backgroundColor: contactList.color || "#4f46e5",
                                }}
                            >
                                <i className="material-symbols-outlined fs-36">list_alt</i>
                            </div>
                            <h3 className="mb-2">{contactList.name}</h3>
                            {contactList.color && (
                                <span className="badge px-3 py-2 mb-2" style={{ backgroundColor: contactList.color }}>
                                    {contactList.color}
                                </span>
                            )}
                            {contactList.team && (
                                <span className="badge bg-info text-white">{contactList.team.team_name}</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="mb-0">List Details</h3>
                            <div className="d-flex gap-2">
                                <Link href={`/admin/contact-lists/${contactList.id}/edit`} className="btn btn-primary text-white">
                                    Edit
                                </Link>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">List Name</label>
                                <div className="form-control bg-light">{contactList.name || "—"}</div>
                            </div>

                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">Color</label>
                                <div className="form-control bg-light d-flex align-items-center gap-2">
                                    {contactList.color ? (
                                        <>
                                            <span
                                                className="rounded-circle d-inline-block"
                                                style={{ width: "16px", height: "16px", backgroundColor: contactList.color }}
                                            />
                                            {contactList.color}
                                        </>
                                    ) : "—"}
                                </div>
                            </div>

                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">Assigned Team</label>
                                <div className="form-control bg-light">{contactList.team?.team_name || "—"}</div>
                            </div>

                            <div className="col-md-6 mb-4">
                                <label className="label fs-14 text-muted mb-2">Creator</label>
                                <div className="form-control bg-light">
                                    {contactList.creator
                                        ? `${contactList.creator.first_name} ${contactList.creator.last_name}`
                                        : "—"}
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-12 mb-4">
                                    <label className="label fs-14 text-muted mb-2">Description</label>
                                    <div className="form-control bg-light" style={{ minHeight: "80px", whiteSpace: "pre-wrap" }}>
                                        {contactList.description || "—"}
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-12 mb-4">
                                    <label className="label fs-14 text-muted mb-2">Contacts</label>
                                    {contacts.length > 0 ? (
                                        <form onSubmit={handleBulkRemove}>
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th scope="col"><input type="checkbox" onChange={toggleSelectAll} checked={selectedRemoveContacts.length === contacts.length && contacts.length > 0} /></th>
                                                        <th scope="col">Name</th>
                                                        <th scope="col">Email</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {contacts.map(contact => (
                                                        <tr key={contact.id}>
                                                            <td>
                                                                <input type="checkbox" value={contact.id}
                                                                    checked={selectedRemoveContacts.includes(contact.id)}
                                                                    onChange={() => toggleContact(contact.id)} />
                                                            </td>
                                                            <td>{contact.name || "—"}</td>
                                                            <td>{contact.email || "—"}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <div className="d-flex gap-2 mt-2">
                                                <Link href={`/admin/contact-lists/${contactList.id}/edit`} className="btn btn-success">Add Contacts</Link>
                                                <button type="submit" className="btn btn-danger" disabled={selectedRemoveContacts.length === 0}>Remove Selected</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            <div className="alert alert-info mb-3">No contacts found.</div>
                                            <Link href={`/admin/contact-lists/${contactList.id}/edit`} className="btn btn-success">Add Contacts</Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
