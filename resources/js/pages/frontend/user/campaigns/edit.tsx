import React from 'react';
import UserLayout from '@/layouts/user-layout';
import { Head, Link, useForm } from '@inertiajs/react';

interface SelectOption { id: number; title?: string; name?: string; phone_number?: string; label?: string; }

interface Campaign {
    id: number;
    campaign_name: string;
    description: string | null;
    campaign_type: string;
    template_id: number | null;
    sim_id: number | null;
    recipient_list_ids: number[] | null;
    schedule_type: string;
    date: string | null;
    time: string | null;
    status: string;
    is_active: boolean;
    is_draft: boolean;
}

interface Props {
    campaign: Campaign;
    templates: SelectOption[];
    lists: SelectOption[];
    sims: SelectOption[];
}

export default function Edit({ campaign, templates, lists, sims }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        campaign_name: campaign.campaign_name || '',
        description: campaign.description || '',
        campaign_type: campaign.campaign_type || 'regular',
        template_id: campaign.template_id?.toString() || '',
        sim_id: campaign.sim_id?.toString() || '',
        recipient_list_ids: campaign.recipient_list_ids || ([] as number[]),
        schedule_type: campaign.schedule_type || 'now',
        date: campaign.date || '',
        time: campaign.time || '',
        status: campaign.status || 'draft',
        is_active: campaign.is_active !== false,
        is_draft: !!campaign.is_draft,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/user/campaigns/' + campaign.id);
    };

    const toggleList = (id: number) => {
        const current = data.recipient_list_ids;
        setData('recipient_list_ids', current.includes(id) ? current.filter(i => i !== id) : [...current, id]);
    };

    return (
        <UserLayout title="Edit Campaign">
            <Head title="Edit Campaign" />

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-header bg-white border-bottom p-4">
                    <h5 className="mb-0 fw-bold">Edit Campaign</h5>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Campaign Name *</label>
                                <input type="text" className={`form-control ${errors.campaign_name ? 'is-invalid' : ''}`}
                                    value={data.campaign_name} onChange={e => setData('campaign_name', e.target.value)} required />
                                {errors.campaign_name && <div className="invalid-feedback">{errors.campaign_name}</div>}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Type *</label>
                                <select className="form-select" value={data.campaign_type} onChange={e => setData('campaign_type', e.target.value)}>
                                    <option value="regular">Regular</option>
                                    <option value="automated">Automated</option>
                                    <option value="ab_test">A/B Test</option>
                                </select>
                            </div>
                            <div className="col-12">
                                <label className="form-label">Description</label>
                                <textarea className="form-control" rows={3} value={data.description} onChange={e => setData('description', e.target.value)} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Message Template</label>
                                <select className="form-select" value={data.template_id} onChange={e => setData('template_id', e.target.value)}>
                                    <option value="">— Select Template —</option>
                                    {templates.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">SIM Card</label>
                                <select className="form-select" value={data.sim_id} onChange={e => setData('sim_id', e.target.value)}>
                                    <option value="">— Select SIM —</option>
                                    {sims.map(s => <option key={s.id} value={s.id}>{s.label || s.phone_number}</option>)}
                                </select>
                            </div>
                            <div className="col-12">
                                <label className="form-label">Recipient Lists</label>
                                <div className="d-flex flex-wrap gap-2">
                                    {lists.length > 0 ? lists.map(l => (
                                        <div key={l.id} className={`badge rounded-pill px-3 py-2 ${data.recipient_list_ids.includes(l.id) ? 'bg-primary text-white' : 'bg-light text-dark border'}`}
                                            style={{ cursor: 'pointer' }} onClick={() => toggleList(l.id)}>
                                            {l.name}
                                        </div>
                                    )) : <span className="text-muted">No lists available</span>}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Schedule *</label>
                                <select className="form-select" value={data.schedule_type} onChange={e => setData('schedule_type', e.target.value)}>
                                    <option value="now">Send Immediately</option>
                                    <option value="later">Schedule for Later</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Status *</label>
                                <select className="form-select" value={data.status} onChange={e => setData('status', e.target.value)}>
                                    <option value="draft">Draft</option>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="sending">Sending</option>
                                    <option value="completed">Completed</option>
                                    <option value="paused">Paused</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>
                            <div className="col-md-4 d-flex align-items-center mt-4">
                                <div className="form-check form-switch">
                                    <input 
                                        type="checkbox" 
                                        className="form-check-input" 
                                        id="is_active" 
                                        checked={data.is_active} 
                                        onChange={e => setData('is_active', e.target.checked)} 
                                    />
                                    <label className="form-check-label ms-2 fw-medium" htmlFor="is_active">Active</label>
                                </div>
                            </div>
                            <div className="col-md-4 d-flex align-items-center mt-4">
                                <div className="form-check form-switch">
                                    <input 
                                        type="checkbox" 
                                        className="form-check-input" 
                                        id="is_draft" 
                                        checked={data.is_draft} 
                                        onChange={e => {
                                            const val = e.target.checked;
                                            setData(d => ({ ...d, is_draft: val, status: val ? 'draft' : (d.status === 'draft' ? 'scheduled' : d.status) }));
                                        }} 
                                    />
                                    <label className="form-check-label ms-2 fw-medium" htmlFor="is_draft">Draft</label>
                                </div>
                            </div>
                            {data.schedule_type === 'later' && (
                                <>
                                    <div className="col-md-4">
                                        <label className="form-label">Date</label>
                                        <input type="date" className="form-control" value={data.date} onChange={e => setData('date', e.target.value)} />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Time</label>
                                        <input type="time" className="form-control" value={data.time} onChange={e => setData('time', e.target.value)} />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="mt-4 pt-3 border-top d-flex justify-content-end gap-2">
                            <Link href="/user/campaigns" className="btn btn-light">Cancel</Link>
                            <button type="submit" className="btn btn-primary" disabled={processing}>
                                {processing ? 'Saving...' : 'Update Campaign'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </UserLayout>
    );
}
