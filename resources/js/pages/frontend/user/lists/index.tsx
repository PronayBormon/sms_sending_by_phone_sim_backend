import React from 'react';
import UserLayout from '@/layouts/user-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Users, Eye, Edit2, Trash2, Plus, Folder, UserCheck, Crown, Mail, UserX, Calendar } from 'lucide-react';

interface ContactList {
    id: number;
    name: string;
    status: string;
    contacts_count: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    lists: {
        data: ContactList[];
        current_page: number;
        last_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
}

// Map color palettes and icons dynamically for beautiful grid cards
const getTheme = (index: number, name: string) => {
    const lowerName = name.toLowerCase();
    const themes = [
        { bg: 'bg-primary-subtle', text: 'text-primary', icon: <Users size={20} /> },
        { bg: 'bg-success-subtle', text: 'text-success', icon: <UserCheck size={20} /> },
        { bg: 'bg-purple-subtle', text: 'text-purple', icon: <Crown size={20} /> },
        { bg: 'bg-warning-subtle', text: 'text-warning', icon: <Mail size={20} /> },
        { bg: 'bg-secondary-subtle', text: 'text-secondary', icon: <UserX size={20} /> },
        { bg: 'bg-danger-subtle', text: 'text-danger', icon: <Calendar size={20} /> }
    ];

    if (lowerName.includes('customer')) return themes[0];
    if (lowerName.includes('lead')) return themes[1];
    if (lowerName.includes('vip')) return themes[2];
    if (lowerName.includes('newsletter') || lowerName.includes('subscriber')) return themes[3];
    if (lowerName.includes('inactive')) return themes[4];
    if (lowerName.includes('event') || lowerName.includes('attendee')) return themes[5];

    return themes[index % themes.length];
};

export default function Index({ lists }: Props) {
    const handleDelete = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this contact list? All list mappings will be removed.')) {
            router.delete(`/user/lists/${id}`);
        }
    };

    return (
        <UserLayout title="Contact Lists">
            <Head title="Contact Lists" />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-1">Contact Lists</h4>
                    <p className="text-muted small mb-0">Group and manage your audiences</p>
                </div>
                <Link href="/user/lists/create" className="btn btn-primary text-white rounded-3 d-flex align-items-center gap-2">
                    <Plus size={16} /> Create List
                </Link>
            </div>

            <div className="row g-4 mb-4">
                {lists.data.map((list, index) => {
                    const theme = getTheme(index, list.name);
                    return (
                        <div className="col-12 col-md-6 col-lg-4" key={list.id}>
                            <div 
                                className="card border-0 shadow-sm rounded-4 h-100 position-relative hover-shadow transition-all"
                                style={{ cursor: 'pointer' }}
                                onClick={() => router.visit(`/user/lists/${list.id}`)}
                            >
                                <div className="card-body p-4 d-flex flex-column justify-content-between">
                                    {/* Card Header Info & Quick Actions */}
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className={`rounded-3 p-2 d-flex align-items-center justify-content-center ${theme.bg} ${theme.text}`} style={{ width: 44, height: 44 }}>
                                            {theme.icon}
                                        </div>
                                        <div className="d-flex align-items-center gap-1">
                                            <Link 
                                                href={`/user/lists/${list.id}`} 
                                                className="btn btn-light btn-sm rounded-circle p-1.5 text-muted hover-primary"
                                                onClick={e => e.stopPropagation()}
                                            >
                                                <Eye size={14} />
                                            </Link>
                                            <Link 
                                                href={`/user/lists/${list.id}/edit`} 
                                                className="btn btn-light btn-sm rounded-circle p-1.5 text-muted hover-primary"
                                                onClick={e => e.stopPropagation()}
                                            >
                                                <Edit2 size={14} />
                                            </Link>
                                            <button 
                                                onClick={e => handleDelete(list.id, e)} 
                                                className="btn btn-light btn-sm rounded-circle p-1.5 text-muted hover-danger"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Name & Count */}
                                    <div className="mb-4">
                                        <h5 className="fw-bold text-dark mb-1 text-truncate">{list.name}</h5>
                                        <div className="d-flex align-items-baseline gap-2">
                                            <span className="fs-3 fw-bold text-dark">{(list.contacts_count || 0).toLocaleString()}</span>
                                            <span className="text-muted small">contacts</span>
                                        </div>
                                    </div>

                                    {/* Dates & Status */}
                                    <div className="border-top pt-3 d-flex justify-content-between align-items-center text-muted" style={{ fontSize: '11px' }}>
                                        <span>Created {new Date(list.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        <span>Updated {new Date(list.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Empty / Dotted "Create New List" Card */}
                <div className="col-12 col-md-6 col-lg-4">
                    <Link 
                        href="/user/lists/create" 
                        className="card border-2 border-dashed rounded-4 h-100 d-flex align-items-center justify-content-center p-5 text-center text-decoration-none text-muted bg-transparent hover-border-primary"
                        style={{ minHeight: '210px' }}
                    >
                        <div className="d-flex flex-column align-items-center gap-2">
                            <div className="bg-light rounded-circle p-3 mb-1">
                                <Plus size={24} className="text-muted" />
                            </div>
                            <span className="fw-medium text-dark">Create New List</span>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Pagination */}
            {lists.last_page > 1 && (
                <div className="d-flex justify-content-between align-items-center p-3 card border-0 shadow-sm rounded-4">
                    <small className="text-muted">Showing {lists.data.length} of {lists.total} lists</small>
                    <ul className="pagination pagination-sm mb-0">
                        {lists.links.map((link, index) => (
                            <li key={index} className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}>
                                <Link className="page-link" href={link.url || '#'} dangerouslySetInnerHTML={{ __html: link.label }} />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </UserLayout>
    );
}
