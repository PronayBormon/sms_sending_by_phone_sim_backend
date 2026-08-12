import { Head, Link, useForm } from '@inertiajs/react';
import Select from 'react-select';
import { toast } from 'sonner';

export default function Create({ teams = [] }: any) {
    const { data, setData, post, processing, errors } = useForm({
        team_id: '', name: '', device_id: '', imei: '', manufacturer: '', model: '', android_version: '', app_version: '',
        status: 'offline', device_token: '', is_active: true,
    });
    const selectedTeam = teams.find((team: any) => String(team.id) === data.team_id);
    const submit = (event: React.FormEvent) => { event.preventDefault(); post('/admin/devices', { onError: (formErrors) => Object.values(formErrors).forEach((message) => toast.error(message)) }); };
    const error = (name: keyof typeof errors) => errors[name] && <div className="text-danger mt-1">{errors[name]}</div>;
    return <><Head title="Add Device" /><div className="row"><div className="col-lg-8"><div className="card bg-white p-20 rounded-10 border border-white mb-4"><h3 className="mb-20">Add Device</h3><form onSubmit={submit}><div className="row">
        <div className="col-md-6 mb-20"><label className="label fs-16 mb-2">Assigned Team</label><Select isClearable options={teams.map((team: any) => ({ value: String(team.id), label: team.team_name }))} value={selectedTeam ? { value: data.team_id, label: selectedTeam.team_name } : null} onChange={(option) => setData('team_id', option?.value ?? '')} placeholder="Select Team" styles={{ control: (base) => ({ ...base, minHeight: '45px', borderColor: '#e2e8f0' }) }} />{error('team_id')}</div>
        <div className="col-md-6 mb-20"><label className="label fs-16 mb-2">Device Name</label><input required className="form-control" value={data.name} onChange={(event) => setData('name', event.target.value)} placeholder="e.g. Office SMS Gateway" />{error('name')}</div>
        <div className="col-md-6 mb-20"><label className="label fs-16 mb-2">Device ID</label><input required className="form-control" value={data.device_id} onChange={(event) => setData('device_id', event.target.value)} placeholder="Unique device identifier" />{error('device_id')}</div>
        <div className="col-md-6 mb-20"><label className="label fs-16 mb-2">IMEI</label><input className="form-control" value={data.imei} onChange={(event) => setData('imei', event.target.value)} placeholder="Optional IMEI" />{error('imei')}</div>
        <div className="col-md-6 mb-20"><label className="label fs-16 mb-2">Manufacturer</label><input className="form-control" value={data.manufacturer} onChange={(event) => setData('manufacturer', event.target.value)} placeholder="e.g. Samsung" /></div>
        <div className="col-md-6 mb-20"><label className="label fs-16 mb-2">Model</label><input className="form-control" value={data.model} onChange={(event) => setData('model', event.target.value)} placeholder="e.g. Galaxy A54" /></div>
        <div className="col-md-6 mb-20"><label className="label fs-16 mb-2">Android Version</label><input className="form-control" value={data.android_version} onChange={(event) => setData('android_version', event.target.value)} placeholder="e.g. Android 14" /></div>
        <div className="col-md-6 mb-20"><label className="label fs-16 mb-2">App Version</label><input className="form-control" value={data.app_version} onChange={(event) => setData('app_version', event.target.value)} placeholder="e.g. 1.0.0" /></div>
        <div className="col-md-6 mb-20"><label className="label fs-16 mb-2">Status</label><select className="form-select" value={data.status} onChange={(event) => setData('status', event.target.value)}><option value="offline">Offline</option><option value="online">Online</option><option value="inactive">Inactive</option></select>{error('status')}</div>
        <div className="col-md-6 mb-20"><label className="label fs-16 mb-2">Device Token</label><input className="form-control" value={data.device_token} onChange={(event) => setData('device_token', event.target.value)} placeholder="Optional authentication token" />{error('device_token')}</div>
        <div className="col-12 mb-20"><div className="form-check"><input id="is_active" className="form-check-input" type="checkbox" checked={data.is_active} onChange={(event) => setData('is_active', event.target.checked)} /><label htmlFor="is_active" className="form-check-label">Active device</label></div></div>
        <div className="col-12"><div className="d-flex gap-2"><button className="btn btn-primary text-white" disabled={processing}>Add Device</button><Link href="/admin/devices" className="btn btn-secondary">Cancel</Link></div></div>
    </div></form></div></div><div className="col-lg-4"><div className="card bg-white p-20 rounded-10 border border-white mb-4"><h3 className="mb-3">Device Details</h3><p className="text-muted mb-0">Add the device first, then attach one or more SIMs from the Devices & SIMs page.</p></div></div></div></>;
}
