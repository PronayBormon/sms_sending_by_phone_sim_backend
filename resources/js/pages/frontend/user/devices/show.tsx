import React from 'react';
import UserLayout from '@/layouts/user-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Battery, Wifi, Smartphone, PowerOff, Edit2, Download } from 'lucide-react';

export default function DeviceDetails({ id }: { id: string }) {
    const sims = [
        { slot: 'SIM 1', carrier: 'Grameenphone', phone: '+88016••••••68', status: 'Active', msgs: '820' },
        { slot: 'SIM 2', carrier: 'Robi', phone: '+88018••••••45', status: 'Active', msgs: '420' },
    ];

    return (
        <UserLayout title="Device Details">
            <Head title="Device Details" />

            <div className="d-flex align-items-center gap-3 mb-4">
                <Link href="/user/devices" className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                    <ArrowLeft size={18} className="text-muted" />
                </Link>
                <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2">
                        <h4 className="mb-0 fw-bold">Galaxy A15</h4>
                        <span className="badge bg-success-subtle text-success rounded-pill px-3 py-2">Online</span>
                    </div>
                    <p className="text-muted mb-0 font-monospace small">{id || 'GW-8F32A91C'}</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
                        <Edit2 size={14} /> Rename
                    </button>
                    <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
                        <Download size={14} /> Update App
                    </button>
                    <button className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1">
                        <PowerOff size={14} /> Disconnect
                    </button>
                </div>
            </div>

            <div className="row g-4">
                {/* Device Info */}
                <div className="col-12 col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-4">
                            <h6 className="fw-bold mb-4">Device Information</h6>
                            
                            <div className="d-flex flex-column gap-3">
                                <div className="d-flex justify-content-between align-items-center pb-2 border-bottom">
                                    <span className="text-muted small">Gateway ID</span>
                                    <span className="fw-medium font-monospace small">{id || 'GW-8F32A91C'}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center pb-2 border-bottom">
                                    <span className="text-muted small">Android Version</span>
                                    <span className="fw-medium small">15</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center pb-2 border-bottom">
                                    <span className="text-muted small">App Version</span>
                                    <span className="fw-medium small">1.0.0</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center pb-2 border-bottom">
                                    <span className="text-muted small">Last Seen</span>
                                    <span className="fw-medium small">Just now</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-2">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="text-muted small d-flex align-items-center gap-2">
                                        <Battery size={16} /> Battery
                                    </span>
                                    <span className="fw-bold small">82%</span>
                                </div>
                                <div className="progress mb-3" style={{ height: 8 }}>
                                    <div className="progress-bar bg-success" style={{ width: '82%' }}></div>
                                </div>

                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="text-muted small d-flex align-items-center gap-2">
                                        <Wifi size={16} /> Network
                                    </span>
                                    <span className="fw-bold small">Wi-Fi</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SIM Cards */}
                <div className="col-12 col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-4">
                            <h6 className="fw-bold mb-4">SIM Cards</h6>
                            <div className="d-flex flex-column gap-3">
                                {sims.map((s, idx) => (
                                    <div key={idx} className="bg-light rounded-4 p-3 border">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="fw-bold small">{s.slot}</span>
                                            <span className="badge bg-success-subtle text-success rounded-pill">{s.status}</span>
                                        </div>
                                        <div className="text-muted small">{s.carrier}</div>
                                        <div className="font-monospace small mt-1">{s.phone}</div>
                                        <div className="text-muted small mt-2 pt-2 border-top">{s.msgs} messages today</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="col-12 col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-4">
                            <h6 className="fw-bold mb-4">Statistics</h6>
                            <div className="d-flex flex-column gap-3">
                                <div className="d-flex justify-content-between align-items-center pb-3 border-bottom">
                                    <span className="text-muted small">Messages Today</span>
                                    <span className="fw-bold fs-5 text-primary">1,240</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center pb-3 border-bottom">
                                    <span className="text-muted small">Messages This Month</span>
                                    <span className="fw-bold fs-5">32,420</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center pb-3 border-bottom">
                                    <span className="text-muted small">Failed</span>
                                    <span className="fw-bold fs-5 text-danger">230</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center pb-3">
                                    <span className="text-muted small">Delivery Rate</span>
                                    <span className="fw-bold fs-5 text-success">99.3%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
