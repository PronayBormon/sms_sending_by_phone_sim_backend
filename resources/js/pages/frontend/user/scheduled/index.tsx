import React from 'react';
import UserLayout from '@/layouts/user-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Clock, Edit2, Play, X, Eye } from 'lucide-react';
import { confirmAction } from '@/utils/confirm';
import { useIsViewer } from '@/hooks/useRole';

interface Campaign {
    id: number;
    campaign_name: string;
    recipient_list_ids: string[];
    sim: { phone_number: string } | null;
    date: string | null;
    time: string | null;
    timezone: string | null;
    status: string;
}

interface Props {
    scheduled: {
        data: Campaign[];
        current_page: number;
        last_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
}

export default function Scheduled({ scheduled }: Props) {
    const isViewer = useIsViewer();
    return (
        <UserLayout title="Scheduled Campaigns">
            <Head title="Scheduled Campaigns" />

            <div className="mb-4">
                <h4 className="fw-bold mb-1">Scheduled Campaigns</h4>
                <p className="text-muted small">Campaigns queued for future delivery</p>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-4 py-3">Campaign</th>
                                    <th className="py-3">Lists</th>
                                    <th className="py-3">Gateway / SIM</th>
                                    <th className="py-3">Scheduled Time</th>
                                    <th className="py-3">Timezone</th>
                                    <th className="py-3">Status</th>
                                    <th className="px-4 py-3 text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scheduled.data.map(s => (
                                    <tr key={s.id}>
                                        <td className="px-4">
                                            <div className="d-flex align-items-center gap-2">
                                                <Clock size={14} className="text-warning flex-shrink-0" />
                                                <span className="fw-medium text-dark">{s.campaign_name}</span>
                                            </div>
                                        </td>
                                        <td>{s.recipient_list_ids?.length || 0} list(s)</td>
                                        <td>{s.sim?.phone_number || 'Auto-select'}</td>
                                        <td className="fw-medium text-dark">
                                            {s.date ? new Date(s.date).toLocaleDateString() : 'N/A'} {s.time || ''}
                                        </td>
                                        <td className="text-muted">{s.timezone || 'UTC'}</td>
                                        <td>
                                            <span className="badge rounded-pill bg-warning-subtle text-warning px-3 py-2">
                                                {s.status}
                                            </span>
                                        </td>
                                        <td className="px-4 text-end">
                                            <div className="d-flex align-items-center justify-content-end gap-1">
                                                <Link href={`/user/campaigns/${s.id}`} className="btn btn-sm btn-light text-primary d-flex align-items-center justify-content-center p-2" title="View">
                                                    <Eye size={13} />
                                                </Link>
                                                {!isViewer && (
                                                    <>
                                                        <Link href={`/user/campaigns/${s.id}/edit`} className="btn btn-sm btn-light text-muted d-flex align-items-center justify-content-center p-2" title="Edit">
                                                            <Edit2 size={13} />
                                                        </Link>
                                                        <button className="btn btn-sm btn-light text-success d-flex align-items-center justify-content-center p-2" title="Run Now">
                                                            <Play size={13} />
                                                        </button>
                                                        <button 
                                                            onClick={async () => {
                                                                const ok = await confirmAction({ text: 'This scheduled campaign will be cancelled.', confirmText: 'Yes, cancel it' });
                                                                if (ok) router.delete(`/user/campaigns/${s.id}`);
                                                            }}
                                                            className="btn btn-sm btn-light text-danger d-flex align-items-center justify-content-center p-2" 
                                                            title="Cancel"
                                                        >
                                                            <X size={13} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {scheduled.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-center py-5 text-muted">No scheduled campaigns found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {scheduled.last_page > 1 && (
                    <div className="card-footer bg-white p-4 border-top">
                        <div className="d-flex align-items-center justify-content-between">
                            <small className="text-muted">Showing {scheduled.data.length} of {scheduled.total}</small>
                            <ul className="pagination pagination-sm mb-0">
                                {scheduled.links.map((link, index) => (
                                    <li key={index} className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}>
                                        <Link className="page-link" href={link.url || '#'} dangerouslySetInnerHTML={{ __html: link.label }} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </UserLayout>
    );
}
