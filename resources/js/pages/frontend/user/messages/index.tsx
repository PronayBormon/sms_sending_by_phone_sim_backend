import React, { useState } from 'react';
import UserLayout from '@/layouts/user-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Filter, Eye } from 'lucide-react';

interface SmsLog {
    id: number;
    recipient: string;
    campaign: { campaign_name: string, id: string } | null;
    message: string;
    device: { name: string } | null;
    sim_slot: string;
    status: string;
    sent_at: string | null;
    delivered_at: string | null;
    created_at: string;
}

interface Props {
    messages: {
        data: SmsLog[];
        current_page: number;
        last_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
        status?: string;
    };
}

const statusBadge = (s: string) => {
    const map: Record<string, string> = {
        Delivered: 'bg-success-subtle text-success',
        Failed: 'bg-danger-subtle text-danger',
        Queued: 'bg-warning-subtle text-warning',
        Sending: 'bg-info-subtle text-info',
        Sent: 'bg-secondary-subtle text-secondary',
        Cancelled: 'bg-secondary-subtle text-secondary'
    };
    return <span className={`badge rounded-pill px-3 py-2 ${map[s] ?? 'bg-secondary-subtle text-secondary'}`}>{s}</span>;
}

export default function Messages({ messages, filters }: Props) {
    const [search, setSearch] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || 'All');

    const statuses = ['All', 'Queued', 'Sending', 'Sent', 'Delivered', 'Failed', 'Cancelled'];

    const handleFilter = (status: string) => {
        setStatusFilter(status);
        applyFilters(search, status);
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            applyFilters(search, statusFilter);
        }
    };

    const applyFilters = (s: string, stat: string) => {
        router.get('/user/messages', { search: s, status: stat }, { preserveState: true, preserveScroll: true });
    };

    return (
        <UserLayout title="Messages">
            <Head title="Messages" />

            <div className="mb-4">
                <h4 className="fw-bold mb-1">Messages</h4>
                <p className="text-muted small">Individual message delivery log</p>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-header bg-white border-bottom p-3">
                    <div className="d-flex flex-wrap align-items-center gap-3">
                        <div className="position-relative flex-grow-1" style={{ maxWidth: '300px' }}>
                            <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                onKeyDown={handleSearch}
                                placeholder="Search by phone or campaign..."
                                className="form-control form-control-sm ps-5 py-2 rounded-3 bg-light border-0"
                            />
                        </div>
                        <div className="bg-light p-1 rounded-3 d-flex gap-1">
                            {statuses.map(s => (
                                <button
                                    key={s}
                                    onClick={() => handleFilter(s)}
                                    className={`btn btn-sm border-0 rounded-2 ${statusFilter === s ? 'bg-white shadow-sm fw-medium text-dark' : 'text-muted'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                        <button className="btn btn-sm btn-outline-secondary rounded-3 d-flex align-items-center gap-2 ms-auto">
                            <Filter size={14} /> More Filters
                        </button>
                    </div>
                </div>

                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-4 py-3">Recipient</th>
                                    <th className="py-3">Campaign</th>
                                    <th className="py-3">Message</th>
                                    <th className="py-3">Device</th>
                                    <th className="py-3">SIM</th>
                                    <th className="py-3">Status</th>
                                    <th className="py-3">Sent At</th>
                                    <th className="px-4 py-3">Delivered At</th>
                                    <th className="px-4 py-3 text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {messages.data.map(m => (
                                    <tr key={m.id}>
                                        <td className="px-4">
                                            <div className="fw-medium">{m.recipient}</div>
                                            <small className="text-muted font-monospace">SMS-{m.id}</small>
                                        </td>
                                        <td>
                                            <Link href={"/user/campaigns/" + m.campaign?.id} target='_blank'>
                                                {m.campaign?.campaign_name || '—'}
                                            </Link>

                                        </td>
                                        <td style={{ maxWidth: '200px' }}>
                                            <div className="text-truncate text-muted small">{m.message}</div>
                                        </td>
                                        <td>{m.device?.name || '—'}</td>
                                        <td>{m.sim_slot || '—'}</td>
                                        <td>{statusBadge(m.status)}</td>
                                        <td className="font-monospace small text-muted">{m.sent_at ? new Date(m.sent_at).toLocaleString() : '—'}</td>
                                        <td className="px-4 font-monospace small text-muted">{m.delivered_at ? new Date(m.delivered_at).toLocaleString() : '—'}</td>
                                        <td className="px-4 text-end">
                                            <Link href={`/user/messages/${m.id}`} className="btn btn-sm btn-light text-primary p-2" title="View">
                                                <Eye size={16} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {messages.data.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="text-center py-5 text-muted">No messages found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {messages.last_page > 1 && (
                    <div className="card-footer bg-white p-4 border-top">
                        <div className="d-flex align-items-center justify-content-between">
                            <small className="text-muted">Showing {messages.data.length} of {messages.total} messages</small>
                            <ul className="pagination pagination-sm mb-0">
                                {messages.links.map((link, index) => (
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
