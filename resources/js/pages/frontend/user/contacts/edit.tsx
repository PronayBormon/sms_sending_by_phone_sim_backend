import React from 'react';
import UserLayout from '@/layouts/user-layout';
import { Head, Link, useForm } from '@inertiajs/react';

interface Contact {
    id: number;
    phone: string;
    name: string | null;
    email: string | null;
    company: string | null;
}

interface Props {
    contact: Contact;
}

export default function Edit({ contact }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        phone: contact.phone || '',
        name: contact.name || '',
        email: contact.email || '',
        company: contact.company || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/user/contacts/' + contact.id);
    };

    return (
        <UserLayout title="Edit Contact">
            <Head title="Edit Contact" />

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-header bg-white border-bottom p-4">
                    <h5 className="mb-0 fw-bold">Edit Contact</h5>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="e.g. John Doe"
                                />
                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Phone Number *</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                    value={data.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                    required
                                    placeholder="e.g. +8801700000000"
                                />
                                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="e.g. john@example.com"
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Company</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.company ? 'is-invalid' : ''}`}
                                    value={data.company}
                                    onChange={e => setData('company', e.target.value)}
                                    placeholder="e.g. Acme Corp"
                                />
                                {errors.company && <div className="invalid-feedback">{errors.company}</div>}
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-top d-flex justify-content-end gap-2">
                            <Link href={'/user/contacts'} className="btn btn-light">Cancel</Link>
                            <button type="submit" className="btn btn-primary text-white" disabled={processing}>
                                {processing ? 'Saving...' : 'Update Contact'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </UserLayout>
    );
}
