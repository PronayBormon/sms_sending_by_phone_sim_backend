import React from 'react';
import UserLayout from '@/layouts/user-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { confirmAction } from '@/utils/confirm';
import { useIsViewer } from '@/hooks/useRole';

interface Campaign {
    id: number;
    campaign_name: string;
    campaign_type: string;
    status: string;
    schedule_type: string;
    is_draft: boolean;
    created_at: string;
    template?: { id: number; title: string } | null;
    stats?: { sent: number; delivered: number; failed: number } | null;
}

interface Props {
    campaigns: {
        data: Campaign[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
}

const statusColors: Record<string, string> = {
    draft: 'bg-secondary-subtle text-secondary',
    active: 'bg-success-subtle text-success',
    paused: 'bg-warning-subtle text-warning',
    completed: 'bg-info-subtle text-info',
};

export default function Index({ campaigns }: Props) {
    const isViewer = useIsViewer();
    const { delete: destroy } = useForm();

    const handleDelete = async (id: number) => {
        const ok = await confirmAction({ text: 'This campaign and its data will be permanently deleted.', confirmText: 'Yes, delete it' });
        if (ok) destroy('/user/campaigns/' + id);
    };

    return (
        <UserLayout title="Campaigns">
            <Head title="Campaigns" />

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">Manage Campaigns</h5>
                    <Link href={'/user/campaigns/create'} className="btn btn-primary rounded-3">
                        + New Campaign
                    </Link>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-4 py-3">Campaign Name</th>
                                    <th className="py-3">Type</th>
                                    <th className="py-3">Status</th>
                                    <th className="py-3">Schedule</th>
                                    <th className="py-3">Created</th>
                                    <th className="px-4 py-3 text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {campaigns.data.length > 0 ? (
                                    campaigns.data.map((campaign) => (
                                        <tr key={campaign.id}>
                                            <td className="px-4">
                                                <div className="fw-medium">{campaign.campaign_name}</div>
                                                {campaign.template && (
                                                    <small className="text-muted">Template: {campaign.template.title}</small>
                                                )}
                                            </td>
                                            <td>
                                                <span className="badge bg-primary-subtle text-primary rounded-pill text-uppercase">
                                                    {campaign.campaign_type}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge rounded-pill ${statusColors[campaign.status] || 'bg-secondary-subtle text-secondary'}`}>
                                                    {campaign.is_draft ? 'Draft' : campaign.status}
                                                </span>
                                            </td>
                                            <td className="text-capitalize">{campaign.schedule_type}</td>
                                            <td className="text-muted">{new Date(campaign.created_at).toLocaleDateString()}</td>
                                            <td className="px-4 text-end">
                                                <div className="d-flex align-items-center justify-content-end gap-1">
                                                    <Link href={`/user/campaigns/${campaign.id}`} className="btn btn-sm btn-light text-primary p-2" title="View">
                                                        <Eye size={16} />
                                                    </Link>
                                                    {!isViewer && (
                                                        <Link href={`/user/campaigns/${campaign.id}/edit`} className="btn btn-sm btn-light text-muted p-2" title="Edit">
                                                            <Edit2 size={16} />
                                                        </Link>
                                                    )}
                                                    {!isViewer && (
                                                        <button onClick={() => handleDelete(campaign.id)} className="btn btn-sm btn-light text-danger p-2" title="Delete">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-5 text-muted">
                                            No campaigns yet. Create your first campaign!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {campaigns.last_page > 1 && (
                    <div className="card-footer bg-white p-4 border-top">
                        <ul className="pagination justify-content-end mb-0">
                            {campaigns.links.map((link, index) => (
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
