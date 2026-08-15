import React, { useState } from 'react';
import UserLayout from '@/layouts/user-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Trash2, UserPlus, Mail, Phone, Calendar, Check, Search, X } from 'lucide-react';
import { confirmAction } from '@/utils/confirm';
import { useIsViewer } from '@/hooks/useRole';

interface Contact {
    id: number;
    name: string | null;
    phone: string;
    email: string | null;
    company: string | null;
    created_at: string;
}

interface AvailableContact {
    id: number;
    name: string | null;
    phone: string;
    email: string | null;
}

interface ContactList {
    id: number;
    name: string;
    description: string | null;
    contacts_count: number;
}

interface Props {
    list: ContactList;
    contacts: {
        data: Contact[];
        current_page: number;
        last_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    availableContacts: AvailableContact[];
}

export default function ListShow({ list, contacts, availableContacts }: Props) {
    const isViewer = useIsViewer();
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [addSelectedIds, setAddSelectedIds] = useState<number[]>([]);
    const [modalSearch, setModalSearch] = useState('');

    // Filtered contacts in the "Add Contacts" modal
    const filteredAvailable = availableContacts.filter(c => {
        const q = modalSearch.toLowerCase();
        return !q || (c.name?.toLowerCase().includes(q) || c.phone.includes(q) || c.email?.toLowerCase().includes(q));
    });

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedIds(e.target.checked ? contacts.data.map(c => c.id) : []);
    };

    const handleSelectRow = (id: number, checked: boolean) => {
        setSelectedIds(prev => checked ? [...prev, id] : prev.filter(x => x !== id));
    };

    const handleRemoveSingle = async (contactId: number) => {
        const ok = await confirmAction({ text: 'This contact will be removed from the list.', confirmText: 'Yes, remove' });
        if (ok) router.post(`/user/lists/${list.id}/remove-contact`, { contact_id: contactId }, { preserveScroll: true });
    };

    const handleBulkRemove = async () => {
        const ok = await confirmAction({ text: `${selectedIds.length} selected contact(s) will be removed from this list.`, confirmText: 'Yes, remove all' });
        if (ok) {
            router.post(`/user/lists/${list.id}/bulk-remove-contacts`, { ids: selectedIds }, {
                preserveScroll: true,
                onSuccess: () => setSelectedIds([])
            });
        }
    };

    const handleModalSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddSelectedIds(e.target.checked ? filteredAvailable.map(c => c.id) : []);
    };

    const handleModalSelectRow = (id: number, checked: boolean) => {
        setAddSelectedIds(prev => checked ? [...prev, id] : prev.filter(x => x !== id));
    };

    const handleAddContacts = (e: React.FormEvent) => {
        e.preventDefault();
        if (addSelectedIds.length === 0) return;
        router.post(`/user/lists/${list.id}/add-contacts`, { ids: addSelectedIds }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowAddModal(false);
                setAddSelectedIds([]);
                setModalSearch('');
            }
        });
    };

    return (
        <UserLayout title={`List Details - ${list.name}`}>
            <Head title={`List Details - ${list.name}`} />

            {/* Back + Header */}
            <div className="d-flex align-items-center gap-3 mb-4">
                <Link href="/user/lists" className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                    <ArrowLeft size={18} className="text-muted" />
                </Link>
                <div>
                    <h4 className="mb-0 fw-bold">{list.name}</h4>
                    <p className="text-muted small mb-0">{(list.contacts_count || 0).toLocaleString()} contacts total</p>
                </div>
            </div>

            {/* Bulk Action Banner */}
            {selectedIds.length > 0 && (
                <div className="alert alert-danger border-0 rounded-4 p-3 d-flex align-items-center justify-content-between mb-4 shadow-sm">
                    <div className="d-flex align-items-center gap-2">
                        <Check size={18} className="text-danger" />
                        <span className="fw-medium text-dark">{selectedIds.length} contact(s) selected</span>
                    </div>
                    <div className="d-flex gap-2">
                        {!isViewer && (
                            <button
                                onClick={handleBulkRemove}
                                className="btn btn-sm btn-danger text-white rounded-3 d-flex align-items-center gap-1"
                            >
                                <Trash2 size={14} /> Remove from List
                            </button>
                        )}
                        <button onClick={() => setSelectedIds([])} className="btn btn-sm btn-link text-muted p-0 ms-2">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="mb-1 fw-bold">Contacts in List</h5>
                        <p className="text-muted mb-0 small">Showing {contacts.total} member(s)</p>
                    </div>
                    {!isViewer && (
                        <button
                            onClick={() => { setShowAddModal(true); setAddSelectedIds([]); setModalSearch(''); }}
                            className="btn btn-primary text-white rounded-3 d-flex align-items-center gap-2"
                        >
                            <UserPlus size={16} /> Add Contacts
                        </button>
                    )}
                </div>

                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-4 py-3" style={{ width: 40 }}>
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={contacts.data.length > 0 && selectedIds.length === contacts.data.length}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="py-3">Name</th>
                                    <th className="py-3">Phone</th>
                                    <th className="py-3">Email</th>
                                    <th className="py-3">Company</th>
                                    <th className="py-3">Added At</th>
                                    <th className="px-4 py-3 text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.data.map((c) => (
                                    <tr key={c.id}>
                                        <td className="px-4">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={selectedIds.includes(c.id)}
                                                onChange={e => handleSelectRow(c.id, e.target.checked)}
                                            />
                                        </td>
                                        <td className="fw-medium">{c.name || '—'}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2 text-muted small">
                                                <Phone size={13} />
                                                <span>{c.phone}</span>
                                            </div>
                                        </td>
                                        <td>
                                            {c.email ? (
                                                <div className="d-flex align-items-center gap-2 text-muted small">
                                                    <Mail size={13} />
                                                    <span>{c.email}</span>
                                                </div>
                                            ) : '—'}
                                        </td>
                                        <td className="text-muted small">{c.company || '—'}</td>
                                        <td className="text-muted small">
                                            <div className="d-flex align-items-center gap-2">
                                                <Calendar size={13} />
                                                <span>{new Date(c.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 text-end">
                                            <div className="d-flex align-items-center justify-content-end gap-1">
                                                {!isViewer && (
                                                    <button
                                                        onClick={() => handleRemoveSingle(c.id)}
                                                        className="btn btn-sm btn-outline-danger"
                                                        title="Remove from list"
                                                    >
                                                        <Trash2 size={13} /> Remove
                                                    </button>
                                                )}
                                                {isViewer && <span className="text-muted small fst-italic">View only</span>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {contacts.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-center py-5 text-muted">
                                            No contacts in this list. Click "Add Contacts" to populate it.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {contacts.last_page > 1 && (
                    <div className="card-footer bg-white p-4 border-top">
                        <div className="d-flex align-items-center justify-content-between">
                            <small className="text-muted">Showing {contacts.data.length} of {contacts.total} contacts</small>
                            <ul className="pagination pagination-sm mb-0">
                                {contacts.links.map((link, index) => (
                                    <li key={index} className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}>
                                        <Link className="page-link" href={link.url || '#'} dangerouslySetInnerHTML={{ __html: link.label }} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Contacts Modal */}
            {showAddModal && (
                <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content rounded-4 border-0 shadow-lg">
                            <div className="modal-header border-bottom p-4">
                                <div>
                                    <h5 className="modal-title fw-bold mb-0">Add Contacts to List</h5>
                                    <p className="text-muted small mb-0 mt-1">{addSelectedIds.length} contact(s) selected</p>
                                </div>
                                <button type="button" onClick={() => setShowAddModal(false)} className="btn-close"></button>
                            </div>
                            <form onSubmit={handleAddContacts}>
                                <div className="modal-body p-0">
                                    {/* Search bar */}
                                    <div className="p-3 border-bottom">
                                        <div className="position-relative">
                                            <Search size={15} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                                            <input
                                                value={modalSearch}
                                                onChange={e => setModalSearch(e.target.value)}
                                                placeholder="Search by name or phone..."
                                                className="form-control form-control-sm ps-5 rounded-3 bg-light border-0"
                                            />
                                            {modalSearch && (
                                                <button
                                                    type="button"
                                                    onClick={() => setModalSearch('')}
                                                    className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0 text-muted"
                                                >
                                                    <X size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="table-responsive" style={{ maxHeight: '380px', overflowY: 'auto' }}>
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="table-light sticky-top">
                                                <tr>
                                                    <th className="px-4 py-2" style={{ width: 40 }}>
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            checked={filteredAvailable.length > 0 && addSelectedIds.length === filteredAvailable.length}
                                                            onChange={handleModalSelectAll}
                                                        />
                                                    </th>
                                                    <th className="py-2">Name</th>
                                                    <th className="py-2">Phone</th>
                                                    <th className="py-2">Email</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredAvailable.map(c => (
                                                    <tr
                                                        key={c.id}
                                                        onClick={() => handleModalSelectRow(c.id, !addSelectedIds.includes(c.id))}
                                                        style={{ cursor: 'pointer' }}
                                                        className={addSelectedIds.includes(c.id) ? 'table-primary' : ''}
                                                    >
                                                        <td className="px-4">
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                checked={addSelectedIds.includes(c.id)}
                                                                onChange={e => handleModalSelectRow(c.id, e.target.checked)}
                                                                onClick={e => e.stopPropagation()}
                                                            />
                                                        </td>
                                                        <td className="fw-medium">{c.name || '—'}</td>
                                                        <td className="text-muted small">{c.phone}</td>
                                                        <td className="text-muted small">{c.email || '—'}</td>
                                                    </tr>
                                                ))}
                                                {filteredAvailable.length === 0 && (
                                                    <tr>
                                                        <td colSpan={4} className="text-center py-4 text-muted">
                                                            {modalSearch ? 'No contacts match your search.' : 'All contacts are already in this list.'}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="modal-footer border-top p-4 d-flex justify-content-between align-items-center">
                                    <span className="text-muted small">{filteredAvailable.length} available contact(s)</span>
                                    <div className="d-flex gap-2">
                                        <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-light">Cancel</button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary text-white"
                                            disabled={addSelectedIds.length === 0}
                                        >
                                            Add {addSelectedIds.length > 0 ? `${addSelectedIds.length} ` : ''}Contact(s)
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </UserLayout>
    );
}
