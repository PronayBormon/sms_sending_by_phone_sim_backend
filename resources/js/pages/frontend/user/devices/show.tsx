import React from 'react';
import UserLayout from '@/layouts/user-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Battery, Wifi, Smartphone, PowerOff, Edit2, Download } from 'lucide-react';
import { confirmAction } from '@/utils/confirm';

export default function DeviceDetails({ id, device }: any) {
    const sims = device?.sims || [];
    const stats = device?.stats || { today: 0, month: 0, failed: 0, delivered: 0, total: 0 };
    const deliveryRate = stats.total > 0 ? ((stats.delivered / stats.total) * 100).toFixed(1) : '0.0';

    return (
        <UserLayout title="Device Details">
            <Head title="Device Details" />

            <div className="d-flex align-items-center gap-3 mb-4">
                <Link href="/user/devices" className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                    <ArrowLeft size={18} className="text-muted" />
                </Link>
                <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2">
                        <h4 className="mb-0 fw-bold">{device?.name || 'Unknown Device'}</h4>
                        <span className={`badge ${device?.status === 'online' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'} rounded-pill px-3 py-2`}>
                            {device?.status || 'Offline'}
                        </span>
                    </div>
                    <p className="text-muted mb-0 font-monospace small">{device?.device_id || id}</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
                        <Edit2 size={14} /> Rename
                    </button>
                    <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
                        <Download size={14} /> Update App
                    </button>
                    <button 
                        onClick={async () => {
                            const targetId = device?.id || id;
                            const ok = await confirmAction({ text: 'This will permanently remove this device and all its SIM cards.', confirmText: 'Yes, remove it' });
                            if (ok) router.delete(`/user/devices/${targetId}`);
                        }}
                        className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                    >
                        <PowerOff size={14} /> Remove Device
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
                                    <span className="fw-medium font-monospace small">{device?.device_id || id}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center pb-2 border-bottom">
                                    <span className="text-muted small">Manufacturer & Model</span>
                                    <span className="fw-medium small">{device?.manufacturer} {device?.model}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center pb-2 border-bottom">
                                    <span className="text-muted small">Android Version</span>
                                    <span className="fw-medium small">{device?.android_version || 'N/A'}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center pb-2 border-bottom">
                                    <span className="text-muted small">App Version</span>
                                    <span className="fw-medium small">{device?.app_version || 'N/A'}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center pb-2 border-bottom">
                                    <span className="text-muted small">Last Seen</span>
                                    <span className="fw-medium small">{device?.last_seen_at ? new Date(device.last_seen_at).toLocaleString() : 'Never'}</span>
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
                                {sims.length > 0 ? sims.map((s: any, idx: number) => (
                                    <div key={idx} className="bg-light rounded-4 p-3 border">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="fw-bold small">SIM {s.slot_number}</span>
                                            <span className={`badge ${s.status === 'active' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'} rounded-pill`}>{s.status}</span>
                                        </div>
                                        <div className="text-muted small">{s.carrier_name || 'Unknown Carrier'}</div>
                                        <div className="font-monospace small mt-1">{s.phone_number || 'No Number'}</div>
                                        <div className="text-muted small mt-2 pt-2 border-top">{s.total_sent || 0} total messages</div>
                                    </div>
                                )) : (
                                    <div className="text-muted small text-center py-4">No SIM cards connected</div>
                                )}
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
                                    <span className="fw-bold fs-5 text-primary">{stats.today.toLocaleString()}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center pb-3 border-bottom">
                                    <span className="text-muted small">Messages This Month</span>
                                    <span className="fw-bold fs-5">{stats.month.toLocaleString()}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center pb-3 border-bottom">
                                    <span className="text-muted small">Failed</span>
                                    <span className="fw-bold fs-5 text-danger">{stats.failed.toLocaleString()}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center pb-3">
                                    <span className="text-muted small">Delivery Rate</span>
                                    <span className="fw-bold fs-5 text-success">{deliveryRate}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
