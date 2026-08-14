import React, { useState } from 'react';
import UserLayout from '@/layouts/user-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Upload, Trash2, FolderPlus, Search, X, Check, Info } from 'lucide-react';

interface Contact {
    id: number;
    name: string | null;
    phone: string;
    email: string | null;
    company: string | null;
}

interface ContactList {
    id: number;
    name: string;
}

interface Props {
    contacts: {
        data: Contact[];
        current_page: number;
        last_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    lists: ContactList[];
    filters: {
        search?: string;
    };
}

export default function Index({ contacts, lists, filters }: Props) {
    const [search, setSearch] = useState(filters?.search || '');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showListModal, setShowListModal] = useState(false);
    const [targetListId, setTargetListId] = useState<string>('');

    const importForm = useForm({
        file: null as File | null
    });

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            router.get('/user/contacts', { search }, { preserveState: true, preserveScroll: true });
        }
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(contacts.data.map(c => c.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectRow = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(item => item !== id));
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this contact?')) {
            router.delete('/user/contacts/' + id);
        }
    };

    const handleBulkDelete = () => {
        if (confirm(`Are you sure you want to delete ${selectedIds.length} selected contacts?`)) {
            router.post('/user/contacts/bulk-delete', { ids: selectedIds }, {
                onSuccess: () => setSelectedIds([])
            });
        }
    };

    const handleBulkAddToList = (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetListId) return;

        router.post('/user/contacts/bulk-add-to-list', {
            ids: selectedIds,
            contact_list_id: targetListId
        }, {
            onSuccess: () => {
                setSelectedIds([]);
                setShowListModal(false);
                setTargetListId('');
            }
        });
    };

    const handleImportSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!importForm.data.file) return;

        importForm.post('/user/contacts/import', {
            onSuccess: () => {
                setShowImportModal(false);
                importForm.reset();
            }
        });
    };

    return (
        <UserLayout title="Contacts">
            <Head title="Contacts" />

            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <div>
                    <h4 className="fw-bold mb-1">Contacts</h4>
                    <p className="text-muted small mb-0">Manage your messaging audience</p>
                </div>
                <div className="d-flex gap-2">
                    <button 
                        onClick={() => setShowImportModal(true)} 
                        className="btn btn-outline-secondary rounded-3 d-flex align-items-center gap-2"
                    >
                        <Upload size={16} /> Import Sheets
                    </button>
                    <Link href={'/user/contacts/create'} className="btn btn-primary text-white rounded-3">
                        + Add Contact
                    </Link>
                </div>
            </div>

            {/* Bulk Action Sub-header */}
            {selectedIds.length > 0 && (
                <div className="alert alert-primary border-0 rounded-4 p-3 d-flex align-items-center justify-content-between mb-4 shadow-sm">
                    <div className="d-flex align-items-center gap-2">
                        <Check size={18} className="text-primary" />
                        <span className="fw-medium text-dark">{selectedIds.length} contact(s) selected</span>
                    </div>
                    <div className="d-flex gap-2">
                        <button 
                            onClick={() => setShowListModal(true)}
                            className="btn btn-sm btn-primary text-white rounded-3 d-flex align-items-center gap-1.5"
                        >
                            <FolderPlus size={14} /> Add to List
                        </button>
                        <button 
                            onClick={handleBulkDelete}
                            className="btn btn-sm btn-outline-danger rounded-3 d-flex align-items-center gap-1.5"
                        >
                            <Trash2 size={14} /> Delete Selected
                        </button>
                        <button 
                            onClick={() => setSelectedIds([])}
                            className="btn btn-sm btn-link text-muted p-0 ms-2"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-header bg-white border-bottom p-4">
                    <div className="position-relative" style={{ maxWidth: '300px' }}>
                        <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={handleSearch}
                            placeholder="Search by name, phone, email..."
                            className="form-control form-control-sm ps-5 py-2 rounded-3 bg-light border-0"
                        />
                    </div>
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
                                    <th className="px-4 py-3 text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.data.length > 0 ? (
                                    contacts.data.map((contact) => (
                                        <tr key={contact.id}>
                                            <td className="px-4">
                                                <input 
                                                    type="checkbox" 
                                                    className="form-check-input"
                                                    checked={selectedIds.includes(contact.id)}
                                                    onChange={e => handleSelectRow(contact.id, e.target.checked)}
                                                />
                                            </td>
                                            <td className="fw-medium">{contact.name || '—'}</td>
                                            <td>{contact.phone}</td>
                                            <td>{contact.email || '—'}</td>
                                            <td className="text-muted">{contact.company || '—'}</td>
                                            <td className="px-4 text-end">
                                                <Link href={'/user/contacts/' + contact.id + '/edit'} className="btn btn-sm btn-light me-2">Edit</Link>
                                                <button onClick={() => handleDelete(contact.id)} className="btn btn-sm btn-outline-danger">Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-5 text-muted">
                                            No contacts found. Create your first contact to get started!
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

            {/* Import sheets modal */}
            {showImportModal && (
                <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 border-0 shadow-lg">
                            <div className="modal-header border-bottom p-4">
                                <h5 className="modal-title fw-bold">Import Contacts</h5>
                                <button type="button" onClick={() => setShowImportModal(false)} className="btn-close"></button>
                            </div>
                            <form onSubmit={handleImportSubmit}>
                                <div className="modal-body p-4">
                                    <div className="mb-4 text-muted small bg-light p-3 rounded-3 d-flex gap-2 align-items-start">
                                        <Info size={16} className="text-primary mt-0.5 flex-shrink-0" />
                                        <div>
                                            Upload a <strong>CSV</strong> or <strong>Excel (.xlsx, .xls)</strong> file. 
                                            Columns headers like <code>Name</code>, <code>Phone</code>, <code>Email</code>, <code>Company</code> will be automatically matched.
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Choose File *</label>
                                        <input 
                                            type="file" 
                                            className={`form-control ${importForm.errors.file ? 'is-invalid' : ''}`}
                                            accept=".csv,.xlsx,.xls,.txt"
                                            onChange={e => importForm.setData('file', e.target.files ? e.target.files[0] : null)}
                                            required
                                        />
                                        {importForm.errors.file && <div className="invalid-feedback">{importForm.errors.file}</div>}
                                    </div>
                                </div>
                                <div className="modal-footer border-top p-4 d-flex justify-content-end gap-2">
                                    <button type="button" onClick={() => setShowImportModal(false)} className="btn btn-light">Close</button>
                                    <button type="submit" className="btn btn-primary text-white" disabled={importForm.processing}>
                                        {importForm.processing ? 'Importing...' : 'Upload & Import'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Add to List Modal */}
            {showListModal && (
                <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 border-0 shadow-lg">
                            <div className="modal-header border-bottom p-4">
                                <h5 className="modal-title fw-bold">Add Selected to List</h5>
                                <button type="button" onClick={() => setShowListModal(false)} className="btn-close"></button>
                            </div>
                            <form onSubmit={handleBulkAddToList}>
                                <div className="modal-body p-4">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Select Target List *</label>
                                        <select 
                                            className="form-select" 
                                            value={targetListId} 
                                            onChange={e => setTargetListId(e.target.value)}
                                            required
                                        >
                                            <option value="">-- Choose a list --</option>
                                            {lists.map(list => (
                                                <option key={list.id} value={list.id}>{list.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer border-top p-4 d-flex justify-content-end gap-2">
                                    <button type="button" onClick={() => setShowListModal(false)} className="btn btn-light">Cancel</button>
                                    <button type="submit" className="btn btn-primary text-white">
                                        Add to List
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </UserLayout>
    );
}
