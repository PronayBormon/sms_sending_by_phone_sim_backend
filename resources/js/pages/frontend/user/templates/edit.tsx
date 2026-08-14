import React from 'react';
import UserLayout from '@/layouts/user-layout';
import { Head, Link, useForm } from '@inertiajs/react';

interface Template {
    id: number;
    title: string;
    sub_title: string | null;
    message: string;
    template_type: string;
    is_active: boolean;
}

interface Props {
    template: Template;
}

export default function Edit({ template }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: template.title || '',
        sub_title: template.sub_title || '',
        message: template.message || '',
        template_type: template.template_type || 'private',
        is_active: template.is_active ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/user/templates/${template.id}`);
    };

    return (
        <UserLayout title="Edit Template">
            <Head title="Edit Template" />

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-header bg-white border-bottom p-4">
                    <h5 className="mb-0 fw-bold">Edit Message Template</h5>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Title *</label>
                                <input type="text" className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                    value={data.title} onChange={e => setData('title', e.target.value)} required />
                                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Visibility *</label>
                                <select className="form-select" value={data.template_type} onChange={e => setData('template_type', e.target.value)}>
                                    <option value="private">Private (Only Me)</option>
                                    <option value="public">Public (Team Shared)</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Status</label>
                                <select className="form-select" value={data.is_active ? 'true' : 'false'} onChange={e => setData('is_active', e.target.value === 'true')}>
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>
                            <div className="col-12">
                                <label className="form-label">Subtitle</label>
                                <input type="text" className="form-control" value={data.sub_title} onChange={e => setData('sub_title', e.target.value)} />
                            </div>
                            <div className="col-12">
                                <label className="form-label">Message Content *</label>
                                <textarea className={`form-control ${errors.message ? 'is-invalid' : ''}`} rows={6}
                                    value={data.message} onChange={e => setData('message', e.target.value)} required
                                    placeholder="Type your SMS template here. Use {{variable}} for dynamic content." />
                                {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                                <small className="text-muted mt-1 d-block">Characters: {data.message.length} / 160</small>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-top d-flex justify-content-end gap-2">
                            <Link href={'/user/templates'} className="btn btn-light">Cancel</Link>
                            <button type="submit" className="btn btn-primary" disabled={processing}>
                                {processing ? 'Saving...' : 'Update Template'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </UserLayout>
    );
}
