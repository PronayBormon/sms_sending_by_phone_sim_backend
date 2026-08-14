import React, { useState } from 'react';
import UserLayout from '@/layouts/user-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Smartphone, Signal, WifiOff, CircleSlash, Check, ToggleRight, ToggleLeft } from 'lucide-react';

interface DeviceSim {
    id: number;
    slot_number: number;
    phone_number: string | null;
    carrier_name: string | null;
    operator: string | null;
    subscription_id: string | null;
    sim_serial_number: string | null;
    country_code: string | null;
    status: 'active' | 'inactive' | 'no_signal' | 'disabled';
    is_enabled: boolean;
    total_sent: number;
    total_failed: number;
    last_used_at: string | null;
    device: {
        id: number;
        name: string;
        model: string | null;
        status: string;
    } | null;
}

interface Props {
    sims: {
        data: DeviceSim[];
        current_page: number;
        last_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
}

const statusConfig: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    active:    { label: 'Active',    cls: 'bg-success-subtle text-success',   icon: <Check size={12} /> },
    inactive:  { label: 'Inactive',  cls: 'bg-secondary-subtle text-secondary', icon: <CircleSlash size={12} /> },
    no_signal: { label: 'No Signal', cls: 'bg-warning-subtle text-warning',   icon: <WifiOff size={12} /> },
    disabled:  { label: 'Disabled',  cls: 'bg-danger-subtle text-danger',     icon: <CircleSlash size={12} /> },
};

export default function SimCards({ sims }: Props) {
    const handleToggle = (sim: DeviceSim) => {
        const action = sim.is_enabled ? 'disable' : 'enable';
        if (confirm(`${action === 'enable' ? 'Enable' : 'Disable'} SIM ${sim.slot_number} on ${sim.device?.name}?`)) {
            router.post(`/user/sim-cards/${sim.id}/toggle`, {}, { preserveScroll: true });
        }
    };

    const stats = {
        total: sims.total,
        active: sims.data.filter(s => s.status === 'active').length,
        noSignal: sims.data.filter(s => s.status === 'no_signal').length,
        disabled: sims.data.filter(s => s.status === 'disabled' || !s.is_enabled).length,
    };

    return (
        <UserLayout title="SIM Cards">
            <Head title="SIM Cards" />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-1">SIM Cards</h4>
                    <p className="text-muted small mb-0">Manage SIM slots across all gateway devices</p>
                </div>
                <Link href="/user/devices" className="btn btn-light rounded-3 d-flex align-items-center gap-2">
                    <Smartphone size={16} /> Manage Devices
                </Link>
            </div>

            {/* Stats Strip */}
            <div className="row g-3 mb-4">
                {[
                    { label: 'Total SIMs', value: sims.total, cls: 'text-primary', bg: 'bg-primary-subtle' },
                    { label: 'Active', value: stats.active, cls: 'text-success', bg: 'bg-success-subtle' },
                    { label: 'No Signal', value: stats.noSignal, cls: 'text-warning', bg: 'bg-warning-subtle' },
                    { label: 'Disabled', value: stats.disabled, cls: 'text-danger', bg: 'bg-danger-subtle' },
                ].map((s, i) => (
                    <div className="col-6 col-md-3" key={i}>
                        <div className={`card border-0 shadow-sm rounded-4 ${s.bg} h-100`}>
                            <div className="card-body p-3 d-flex align-items-center gap-3">
                                <div>
                                    <div className={`fs-4 fw-bold ${s.cls}`}>{s.value}</div>
                                    <div className="text-muted small">{s.label}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-4 py-3">SIM Slot</th>
                                    <th className="py-3">Phone Number</th>
                                    <th className="py-3">Carrier</th>
                                    <th className="py-3">Subscription ID</th>
                                    <th className="py-3">Device</th>
                                    <th className="py-3">Status</th>
                                    <th className="py-3">Total Sent</th>
                                    <th className="py-3">Last Used</th>
                                    <th className="px-4 py-3 text-end">Toggle</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sims.data.map((sim) => {
                                    const st = statusConfig[sim.status] || statusConfig.inactive;
                                    return (
                                        <tr key={sim.id} className={!sim.is_enabled ? 'opacity-50' : ''}>
                                            <td className="px-4">
                                                <div className="d-flex align-items-center gap-2">
                                                    <Signal size={15} className="text-muted" />
                                                    <span className="fw-medium">SIM {sim.slot_number}</span>
                                                </div>
                                            </td>
                                            <td>
                                                {sim.phone_number
                                                    ? <code className="small text-dark">{sim.phone_number}</code>
                                                    : <span className="text-muted">—</span>}
                                            </td>
                                            <td>{sim.carrier_name || sim.operator || '—'}</td>
                                            <td>
                                                {sim.subscription_id
                                                    ? <code className="small text-muted">{sim.subscription_id}</code>
                                                    : <span className="text-muted">—</span>}
                                            </td>
                                            <td>
                                                {sim.device ? (
                                                    <Link href={`/user/devices/${sim.device.id}`} className="text-dark text-decoration-none d-flex align-items-center gap-1">
                                                        <Smartphone size={13} className="text-muted" />
                                                        <span className="fw-medium">{sim.device.name}</span>
                                                    </Link>
                                                ) : '—'}
                                            </td>
                                            <td>
                                                <span className={`badge rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-1 ${st.cls}`}>
                                                    {st.icon} {st.label}
                                                </span>
                                            </td>
                                            <td className="fw-semibold">{sim.total_sent.toLocaleString()}</td>
                                            <td className="text-muted small">
                                                {sim.last_used_at ? new Date(sim.last_used_at).toLocaleDateString() : '—'}
                                            </td>
                                            <td className="px-4 text-end">
                                                <button
                                                    onClick={() => handleToggle(sim)}
                                                    className={`btn btn-sm ${sim.is_enabled ? 'btn-outline-danger' : 'btn-outline-success'} rounded-3`}
                                                    title={sim.is_enabled ? 'Disable SIM' : 'Enable SIM'}
                                                >
                                                    {sim.is_enabled
                                                        ? <ToggleLeft size={16} />
                                                        : <ToggleRight size={16} />}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {sims.data.length === 0 && (
                                    <tr>
                                        <td colSpan={9} className="text-center py-5 text-muted">
                                            No SIM cards found. Connect a device to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {sims.last_page > 1 && (
                    <div className="card-footer bg-white p-4 border-top">
                        <div className="d-flex align-items-center justify-content-between">
                            <small className="text-muted">Showing {sims.data.length} of {sims.total} SIMs</small>
                            <ul className="pagination pagination-sm mb-0">
                                {sims.links.map((link, index) => (
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
