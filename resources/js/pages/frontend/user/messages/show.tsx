import React from 'react';
import UserLayout from '@/layouts/user-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle } from 'lucide-react';

interface SmsLog {
    id: number;
    recipient: string;
    campaign: { title: string } | null;
    message: string;
    device: { name: string } | null;
    sim_slot: string;
    status: string;
    queued_at: string | null;
    sent_at: string | null;
    delivered_at: string | null;
    failed_at: string | null;
    error_message: string | null;
}

export default function MessageDetails({ messageLog }: { messageLog: SmsLog }) {
    const timeline = [
        { label: 'Queued', time: messageLog.queued_at, done: !!messageLog.queued_at },
        { label: 'Sent to device', time: messageLog.sent_at, done: !!messageLog.sent_at },
        { label: 'Delivered', time: messageLog.delivered_at, done: !!messageLog.delivered_at },
    ];

    if (messageLog.status === 'Failed') {
        timeline.push({ label: 'Failed', time: messageLog.failed_at, done: true });
    }

    return (
        <UserLayout title="Message Details">
            <Head title="Message Details" />

            <div className="d-flex align-items-center gap-3 mb-4">
                <Link href={route('messages.index')} className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                    <ArrowLeft size={18} className="text-muted" />
                </Link>
                <h4 className="mb-0 fw-bold">Message Details</h4>
            </div>

            <div className="row g-4">
                <div className="col-12 col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
                                <div>
                                    <div className="text-muted font-monospace small mb-1">SMS-{messageLog.id}</div>
                                    <div className="fw-bold fs-5">{messageLog.recipient}</div>
                                </div>
                                <span className={`badge rounded-pill px-3 py-2 ${messageLog.status === 'Delivered' ? 'bg-success-subtle text-success' : messageLog.status === 'Failed' ? 'bg-danger-subtle text-danger' : 'bg-secondary-subtle text-secondary'}`}>
                                    {messageLog.status}
                                </span>
                            </div>

                            <div className="d-flex flex-column gap-3 mb-4">
                                <div className="d-flex gap-4 border-bottom pb-2">
                                    <span className="text-muted small fw-medium" style={{ width: 120 }}>Recipient</span>
                                    <span className="small">{messageLog.recipient}</span>
                                </div>
                                <div className="d-flex gap-4 border-bottom pb-2">
                                    <span className="text-muted small fw-medium" style={{ width: 120 }}>Campaign</span>
                                    <span className="small">{messageLog.campaign?.title || '—'}</span>
                                </div>
                                <div className="d-flex gap-4 border-bottom pb-2">
                                    <span className="text-muted small fw-medium" style={{ width: 120 }}>Gateway</span>
                                    <span className="small">{messageLog.device?.name || '—'}</span>
                                </div>
                                <div className="d-flex gap-4 border-bottom pb-2">
                                    <span className="text-muted small fw-medium" style={{ width: 120 }}>SIM</span>
                                    <span className="small">{messageLog.sim_slot || '—'}</span>
                                </div>
                                {messageLog.error_message && (
                                    <div className="d-flex gap-4 border-bottom pb-2">
                                        <span className="text-muted small fw-medium" style={{ width: 120 }}>Error</span>
                                        <span className="small text-danger">{messageLog.error_message}</span>
                                    </div>
                                )}
                            </div>

                            <div className="d-flex gap-4">
                                <span className="text-muted small fw-medium" style={{ width: 120 }}>Message</span>
                                <div className="flex-grow-1 bg-light border rounded-3 p-3 small text-dark lh-base">
                                    {messageLog.message}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-4">
                            <h6 className="fw-bold mb-4">Delivery Timeline</h6>
                            <div className="position-relative">
                                {timeline.map((t, i) => (
                                    <div key={i} className="d-flex gap-3 mb-4 position-relative">
                                        <div className="d-flex flex-column align-items-center">
                                            <div className={`rounded-circle d-flex align-items-center justify-content-center ${t.done ? (t.label === 'Failed' ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success') : 'bg-light text-muted'}`} style={{ width: 28, height: 28 }}>
                                                <CheckCircle size={16} />
                                            </div>
                                            {i < timeline.length - 1 && (
                                                <div className={`flex-grow-1 my-1 rounded-pill ${t.done ? (t.label === 'Failed' ? 'bg-danger-subtle' : 'bg-success-subtle') : 'bg-light'}`} style={{ width: 2, minHeight: 30 }}></div>
                                            )}
                                        </div>
                                        <div className="pb-2">
                                            <div className={`small fw-medium ${t.done ? 'text-dark' : 'text-muted'}`}>{t.label}</div>
                                            {t.time && <div className="font-monospace text-muted" style={{ fontSize: '11px' }}>{new Date(t.time).toLocaleString()}</div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
