import React, { useState } from 'react';
import UserLayout from '@/layouts/user-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Smartphone, Plus, Wifi, FlaskConical, Eye, Trash2 } from 'lucide-react';
import { confirmAction } from '@/utils/confirm';
import { useIsViewer } from '@/hooks/useRole';

interface DeviceSim {
    id: number;
    slot_number: number;
    phone_number: string | null;
    carrier_name: string | null;
    status: string;
    total_sent: number;
}

interface Device {
    id: number;
    name: string;
    device_id: string;
    manufacturer: string | null;
    model: string | null;
    android_version: string | null;
    status: string;
    last_seen_at: string | null;
    is_active: boolean;
    active_sims_count: number;
    sims: DeviceSim[];
}

interface Props {
    devices: Device[];
}

function batteryColor(pct: number) {
    if (pct > 50) return 'bg-success';
    if (pct > 20) return 'bg-warning';
    return 'bg-danger';
}

export default function Devices({ devices }: Props) {
    const isViewer = useIsViewer();
    const [showDemoModal, setShowDemoModal] = useState(false);
    const [simCount, setSimCount] = useState<1 | 2>(1);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        manufacturer: '',
        model: '',
        android_version: '',
        sim_count: '1',
        sim1_phone: '',
        sim1_carrier: '',
        sim1_operator: '',
        sim1_subscription_id: '',
        sim2_phone: '',
        sim2_carrier: '',
        sim2_operator: '',
        sim2_subscription_id: '',
    });

    const handleSimCountChange = (n: 1 | 2) => {
        setSimCount(n);
        setData('sim_count', String(n));
    };

    const handleDemoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/user/devices/demo', {
            onSuccess: () => {
                setShowDemoModal(false);
                reset();
                setSimCount(1);
            }
        });
    };

    const online = devices.filter(d => d.status === 'online').length;
    const offline = devices.filter(d => d.status !== 'online').length;
    const totalSims = devices.reduce((acc, d) => acc + (d.active_sims_count || 0), 0);

    return (
        <UserLayout title="Devices">
            <Head title="Devices" />

            {/* Stats Row */}
            <div className="row g-3 mb-4">
                {[
                    { label: 'Total Devices', value: devices.length, color: 'text-primary' },
                    { label: 'Online', value: online, color: 'text-success' },
                    { label: 'Offline', value: offline, color: 'text-danger' },
                    { label: 'Active SIMs', value: totalSims, color: 'text-info' },
                ].map((s) => (
                    <div className="col-6 col-md-3" key={s.label}>
                        <div className="card border-0 shadow-sm rounded-4 p-3">
                            <div className={`fs-4 fw-bold ${s.color}`}>{s.value}</div>
                            <div className="text-muted small">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Devices Table */}
            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-header border-bottom p-4 d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="mb-1 fw-bold">Gateway Devices</h5>
                        <p className="text-muted mb-0 small">Manage connected Android gateway devices</p>
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            onClick={() => setShowDemoModal(true)}
                            className="btn btn-outline-secondary rounded-3 d-flex align-items-center gap-2"
                        >
                            <FlaskConical size={16} /> Add Demo Device
                        </button>
                        <Link href="/user/devices/connect" className="btn btn-primary text-white rounded-3 d-flex align-items-center gap-2">
                            <Plus size={16} /> Connect Device
                        </Link>
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-4 py-3">Device</th>
                                    <th className="py-3">Status</th>
                                    <th className="py-3">Model</th>
                                    <th className="py-3">Android</th>
                                    <th className="py-3">SIMs</th>
                                    <th className="px-4 py-3 text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {devices.map((d) => (
                                    <tr key={d.id}>
                                        <td className="px-4">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: 38, height: 38 }}>
                                                    <Smartphone size={16} className="text-muted" />
                                                </div>
                                                <div>
                                                    <div className="fw-medium">{d.name}</div>
                                                    <small className="text-muted font-monospace">{d.device_id}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1 ${d.status === 'online' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                                                {d.status === 'online' && <Wifi size={11} />}
                                                {d.status || 'offline'}
                                            </span>
                                        </td>
                                        <td className="text-muted small">{d.manufacturer ? `${d.manufacturer} ${d.model || ''}`.trim() : (d.model || '—')}</td>
                                        <td className="text-muted small">Android {d.android_version || 'N/A'}</td>
                                        <td>
                                            <div className="d-flex gap-1 flex-wrap">
                                                {d.sims?.map(sim => (
                                                    <span key={sim.id} className={`badge rounded-pill px-2 py-1 ${sim.status === 'active' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                                                        SIM {sim.slot_number}
                                                    </span>
                                                ))}
                                                {(!d.sims || d.sims.length === 0) && <span className="text-muted small">No SIMs</span>}
                                            </div>
                                        </td>
                                        <td className="text-muted small">{d.last_seen_at ? new Date(d.last_seen_at).toLocaleString() : 'Never'}</td>
                                        <td className="px-4 text-end">
                                            <div className="d-flex align-items-center justify-content-end gap-1">
                                                <Link href={`/user/devices/${d.id}`} className="btn btn-sm btn-light text-primary p-2" title="View">
                                                    <Eye size={16} />
                                                </Link>
                                                {!isViewer && (
                                                <button
                                                    title="Remove Device"
                                                    onClick={async () => {
                                                        const ok = await confirmAction({ text: 'This will permanently remove this device and all its SIM cards.', confirmText: 'Yes, remove it' });
                                                        if (ok) router.delete(`/user/devices/${d.id}`);
                                                    }}
                                                    className="btn btn-sm btn-light text-danger p-2"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {devices.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-center py-5 text-muted">
                                            No devices found. Connect a real device or add a demo device.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Demo Device Modal */}
            {showDemoModal && (
                <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content rounded-4 border-0 shadow-lg">
                            <div className="modal-header border-bottom p-4">
                                <div>
                                    <h5 className="modal-title fw-bold mb-0 d-flex align-items-center gap-2">
                                        <FlaskConical size={18} className="text-warning" /> Add Demo Device
                                    </h5>
                                    <p className="text-muted small mb-0 mt-1">Create a simulated gateway device with SIM cards for testing</p>
                                </div>
                                <button type="button" onClick={() => { setShowDemoModal(false); reset(); }} className="btn-close"></button>
                            </div>
                            <form onSubmit={handleDemoSubmit}>
                                <div className="modal-body p-4">
                                    {/* Device Info */}
                                    <p className="fw-semibold text-muted text-uppercase small mb-3" style={{ letterSpacing: '0.5px' }}>Device Information</p>
                                    <div className="row g-3 mb-4">
                                        <div className="col-12">
                                            <label className="form-label fw-medium">Device Name <span className="text-danger">*</span></label>
                                            <input
                                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                placeholder="e.g. Galaxy A15 - Office"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                            />
                                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label fw-medium">Manufacturer</label>
                                            <input
                                                className="form-control"
                                                placeholder="e.g. Samsung"
                                                value={data.manufacturer}
                                                onChange={e => setData('manufacturer', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label fw-medium">Model</label>
                                            <input
                                                className="form-control"
                                                placeholder="e.g. Galaxy A15"
                                                value={data.model}
                                                onChange={e => setData('model', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label fw-medium">Android Version</label>
                                            <input
                                                className="form-control"
                                                placeholder="e.g. 14"
                                                value={data.android_version}
                                                onChange={e => setData('android_version', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* SIM Count Toggle */}
                                    <p className="fw-semibold text-muted text-uppercase small mb-3" style={{ letterSpacing: '0.5px' }}>SIM Card Configuration</p>
                                    <div className="btn-group mb-4" role="group">
                                        <button
                                            type="button"
                                            onClick={() => handleSimCountChange(1)}
                                            className={`btn ${simCount === 1 ? 'btn-primary text-white' : 'btn-outline-secondary'}`}
                                        >
                                            Single SIM
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleSimCountChange(2)}
                                            className={`btn ${simCount === 2 ? 'btn-primary text-white' : 'btn-outline-secondary'}`}
                                        >
                                            Dual SIM
                                        </button>
                                    </div>

                                    {/* SIM 1 */}
                                    <div className="card border rounded-3 mb-3">
                                        <div className="card-header bg-light py-2 px-3">
                                            <span className="fw-semibold small">SIM 1</span>
                                        </div>
                                        <div className="card-body p-3">
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label small fw-medium">Phone Number</label>
                                                    <input className="form-control form-control-sm" placeholder="+880..." value={data.sim1_phone} onChange={e => setData('sim1_phone', e.target.value)} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label small fw-medium">Carrier Name</label>
                                                    <input className="form-control form-control-sm" placeholder="e.g. Grameenphone" value={data.sim1_carrier} onChange={e => setData('sim1_carrier', e.target.value)} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label small fw-medium">Operator</label>
                                                    <input className="form-control form-control-sm" placeholder="e.g. GP" value={data.sim1_operator} onChange={e => setData('sim1_operator', e.target.value)} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label small fw-medium">Subscription ID</label>
                                                    <input className="form-control form-control-sm font-monospace" placeholder="e.g. 1 or 12345" value={data.sim1_subscription_id} onChange={e => setData('sim1_subscription_id', e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SIM 2 */}
                                    {simCount === 2 && (
                                        <div className="card border rounded-3 mb-3">
                                            <div className="card-header bg-light py-2 px-3">
                                                <span className="fw-semibold small">SIM 2</span>
                                            </div>
                                            <div className="card-body p-3">
                                                <div className="row g-3">
                                                    <div className="col-md-6">
                                                        <label className="form-label small fw-medium">Phone Number</label>
                                                        <input className="form-control form-control-sm" placeholder="+880..." value={data.sim2_phone} onChange={e => setData('sim2_phone', e.target.value)} />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label small fw-medium">Carrier Name</label>
                                                        <input className="form-control form-control-sm" placeholder="e.g. Robi" value={data.sim2_carrier} onChange={e => setData('sim2_carrier', e.target.value)} />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label small fw-medium">Operator</label>
                                                        <input className="form-control form-control-sm" placeholder="e.g. Robi" value={data.sim2_operator} onChange={e => setData('sim2_operator', e.target.value)} />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label small fw-medium">Subscription ID</label>
                                                        <input className="form-control form-control-sm font-monospace" placeholder="e.g. 2 or 67890" value={data.sim2_subscription_id} onChange={e => setData('sim2_subscription_id', e.target.value)} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="alert alert-warning border-0 rounded-3 small py-2 px-3 mt-2">
                                        ⚠ Demo devices are marked <strong>offline</strong> and can't send real SMS. Use them to test routing and SIM selection logic.
                                    </div>
                                </div>
                                <div className="modal-footer border-top p-4">
                                    <button type="button" onClick={() => { setShowDemoModal(false); reset(); }} className="btn btn-light">Cancel</button>
                                    <button type="submit" className="btn btn-primary text-white" disabled={processing}>
                                        {processing ? 'Creating...' : 'Create Demo Device'}
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
