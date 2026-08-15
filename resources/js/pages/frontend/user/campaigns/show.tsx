import React from 'react';
import UserLayout from '@/layouts/user-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Users, FileText, Smartphone, Calendar, Clock, BarChart2 } from 'lucide-react';

interface Log {
    id: number;
    recipient: string;
    message: string;
    status: string;
    device?: { name: string } | null;
    created_at: string;
    error_message?: string;
}

interface Campaign {
    id: number;
    campaign_name: string;
    description: string;
    campaign_type: string;
    status: string;
    schedule_type: string;
    date: string | null;
    time: string | null;
    timezone: string | null;
    created_at: string;
    template?: { title: string; message: string } | null;
    sim?: { phone_number: string } | null;
    stats?: { sent: number; delivered: number; failed: number } | null;
}

interface List {
    id: number;
    name: string;
}

interface Props {
    campaign: Campaign;
    logs: {
        data: Log[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    lists: List[];
}

const statusColors: Record<string, string> = {
    draft: 'bg-secondary-subtle text-secondary',
    sending: 'bg-primary-subtle text-primary',
    scheduled: 'bg-warning-subtle text-warning',
    active: 'bg-success-subtle text-success',
    paused: 'bg-warning-subtle text-warning',
    completed: 'bg-info-subtle text-info',
    failed: 'bg-danger-subtle text-danger',
};

const logStatusColors: Record<string, string> = {
    queued: 'bg-secondary-subtle text-secondary',
    sending: 'bg-primary-subtle text-primary',
    sent: 'bg-success-subtle text-success',
    delivered: 'bg-info-subtle text-info',
    failed: 'bg-danger-subtle text-danger',
    cancelled: 'bg-warning-subtle text-warning',
};

export default function Show({ campaign, logs, lists }: Props) {
    return (
        <UserLayout title={`Campaign: ${campaign.campaign_name}`}>
            <Head title={`Campaign: ${campaign.campaign_name}`} />

            <div className="d-flex align-items-center gap-3 mb-4">
                <Link href={'/user/campaigns'} className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                    <ArrowLeft size={18} className="text-muted" />
                </Link>
                <div>
                    <h4 className="mb-0 fw-bold">{campaign.campaign_name}</h4>
                    <div className="text-muted small d-flex align-items-center gap-2 mt-1">
                        <span className={`badge rounded-pill ${statusColors[campaign.status] || 'bg-secondary-subtle text-secondary'}`}>
                            {campaign.status}
                        </span>
                        <span>•</span>
                        <span className="text-uppercase">{campaign.campaign_type}</span>
                    </div>
                </div>
            </div>

            <div className="row g-4 mb-4">
                {/* Campaign Information */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-header bg-white border-bottom p-4">
                            <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                                <FileText size={18} className="text-primary" />
                                Campaign Details
                            </h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <div className="text-muted small mb-1">Description</div>
                                    <div className="fw-medium">{campaign.description || 'N/A'}</div>
                                </div>
                                <div className="col-md-6">
                                    <div className="text-muted small mb-1">Message Template</div>
                                    <div className="fw-medium">{campaign.template?.title || 'N/A'}</div>
                                </div>
                                <div className="col-md-6">
                                    <div className="text-muted small mb-1 d-flex align-items-center gap-1"><Smartphone size={14} /> Gateway / SIM</div>
                                    <div className="fw-medium">{campaign.sim?.phone_number || 'Auto-select'}</div>
                                </div>
                                <div className="col-md-6">
                                    <div className="text-muted small mb-1 d-flex align-items-center gap-1"><Calendar size={14} /> Schedule</div>
                                    <div className="fw-medium">
                                        {campaign.schedule_type === 'now' ? 'Immediate' : (
                                            <>
                                                {campaign.date ? new Date(campaign.date).toLocaleDateString() : 'N/A'} {campaign.time || ''}
                                                <span className="text-muted ms-1">({campaign.timezone || 'UTC'})</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Lists & Stats */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 mb-4">
                        <div className="card-header bg-white border-bottom p-3">
                            <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                                <Users size={18} className="text-primary" />
                                Selected Lists
                            </h6>
                        </div>
                        <div className="card-body p-3">
                            {lists.length > 0 ? (
                                <ul className="list-group list-group-flush">
                                    {lists.map(list => (
                                        <li key={list.id} className="list-group-item px-0 py-2 border-0 d-flex align-items-center gap-2">
                                            <div className="bg-primary-subtle rounded-circle p-1">
                                                <Users size={12} className="text-primary" />
                                            </div>
                                            <span className="fw-medium">{list.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-muted small">No contact lists selected.</div>
                            )}
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-header bg-white border-bottom p-3">
                            <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                                <BarChart2 size={18} className="text-primary" />
                                Statistics
                            </h6>
                        </div>
                        <div className="card-body p-3">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted small">Sent</span>
                                <span className="fw-bold">{campaign.stats?.sent || 0}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted small">Delivered</span>
                                <span className="fw-bold text-success">{campaign.stats?.delivered || 0}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span className="text-muted small">Failed</span>
                                <span className="fw-bold text-danger">{campaign.stats?.failed || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SMS Logs */}
            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-header bg-white border-bottom p-4">
                    <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                        <Clock size={18} className="text-primary" />
                        SMS Logs
                    </h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-4 py-3">Recipient</th>
                                    <th className="py-3">Message</th>
                                    <th className="py-3">Device</th>
                                    <th className="py-3">Status</th>
                                    <th className="py-3">Sent At</th>
                                    <th className="px-4 py-3">Error</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.data.length > 0 ? (
                                    logs.data.map(log => (
                                        <tr key={log.id}>
                                            <td className="px-4 fw-medium">{log.recipient}</td>
                                            <td>
                                                <div className="text-truncate" style={{ maxWidth: '250px' }} title={log.message}>
                                                    {log.message}
                                                </div>
                                            </td>
                                            <td>{log.device?.name || 'Unknown'}</td>
                                            <td>
                                                <span className={`badge rounded-pill ${logStatusColors[log.status] || 'bg-secondary-subtle text-secondary'}`}>
                                                    {log.status}
                                                </span>
                                            </td>
                                            <td className="text-muted small">
                                                {new Date(log.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-4 text-danger small">
                                                {log.error_message || '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-5 text-muted">
                                            No SMS logs found for this campaign.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {logs.last_page > 1 && (
                    <div className="card-footer bg-white p-4 border-top">
                        <ul className="pagination justify-content-end mb-0">
                            {logs.links.map((link, index) => (
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
