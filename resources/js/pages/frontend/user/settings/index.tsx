import React from 'react';
import UserLayout from '@/layouts/user-layout';
import { Head } from '@inertiajs/react';

export default function Index() {
    return (
        <UserLayout title="Under Construction">
            <Head title="Under Construction" />
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
                <h4>Coming Soon</h4>
                <p className="text-muted">This page is currently under development.</p>
            </div>
        </UserLayout>
    );
}
