import React from 'react';
import UserLayout from '@/layouts/user-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit2, Trash2 } from 'lucide-react';
import { confirmAction } from '@/utils/confirm';
import { useIsViewer } from '@/hooks/useRole';

interface Template {
    id: number;
    title: string;
    sub_title: string | null;
    template_type: string;
    message: string;
    is_active: boolean;
    created_at: string;
}

interface Props {
    templates: {
        data: Template[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
}

export default function Index({ templates }: Props) {
    const isViewer = useIsViewer();
    const { delete: destroy } = useForm();

    const handleDelete = async (id: number) => {
        const ok = await confirmAction({ text: 'This template will be permanently deleted.', confirmText: 'Yes, delete it' });
        if (ok) destroy(`/user/templates/${id}`);
    };

    return (
        <UserLayout title="Message Templates">
            <Head title="Message Templates" />

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">Manage Templates</h5>
                    <Link href={'/user/templates/create'} className="btn btn-primary rounded-3">
                        + New Template
                    </Link>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-4 py-3">Title</th>
                                    <th className="py-3">Type</th>
                                    <th className="py-3">Status</th>
                                    <th className="py-3">Preview</th>
                                    <th className="px-4 py-3 text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {templates.data.length > 0 ? (
                                    templates.data.map((template) => (
                                        <tr key={template.id}>
                                            <td className="px-4">
                                                <div className="fw-medium">{template.title}</div>
                                                {template.sub_title && <small className="text-muted">{template.sub_title}</small>}
                                            </td>
                                            <td>
                                                <span className="badge bg-primary-subtle text-primary rounded-pill text-uppercase">
                                                    {template.template_type}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge rounded-pill ${template.is_active ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                                                    {template.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="text-muted" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {template.message.substring(0, 60)}{template.message.length > 60 ? '...' : ''}
                                            </td>
                                            <td className="px-4 text-end">
                                                <div className="d-flex align-items-center justify-content-end gap-1">
                                                    {!isViewer && (
                                                        <Link href={`/user/templates/${template.id}/edit`} className="btn btn-sm btn-light text-muted p-2" title="Edit">
                                                            <Edit2 size={16} />
                                                        </Link>
                                                    )}
                                                    {!isViewer && (
                                                        <button onClick={() => handleDelete(template.id)} className="btn btn-sm btn-light text-danger p-2" title="Delete">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                    {isViewer && <span className="text-muted small fst-italic">Read only</span>}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-5 text-muted">
                                            No templates yet. Create your first message template!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {templates.last_page > 1 && (
                    <div className="card-footer bg-white p-4 border-top">
                        <ul className="pagination justify-content-end mb-0">
                            {templates.links.map((link, index) => (
                                <li key={index} className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}>
                                    <Link className="page-link" href={link.url || '#'} dangerouslySetInnerHTML={{ __html: link.label }} />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </UserLayout>
    );
}
