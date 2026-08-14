import React from 'react';
import UserLayout from '@/layouts/user-layout';
import { Head, router } from '@inertiajs/react';
import { CheckCircle, XCircle, Users } from 'lucide-react';

interface Invite {
    token: string;
    team_name: string;
    role: string;
    email: string;
}

interface Props {
    invite: Invite;
}

export default function Accept({ invite }: Props) {
    const handleConfirm = () => {
        router.post(`/team/accept/${invite.token}/confirm`);
    };

    const handleDecline = () => {
        router.post(`/team/accept/${invite.token}/decline`);
    };

    return (
        <UserLayout title="Team Invitation">
            <Head title="Team Invitation" />

            <div className="d-flex justify-content-center align-items-center py-5">
                <div className="card border-0 shadow-lg rounded-4 p-4 text-center" style={{ maxWidth: '500px', width: '100%' }}>
                    <div className="mx-auto mb-4 bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center" style={{ width: 80, height: 80 }}>
                        <Users size={40} className="text-primary" />
                    </div>

                    <h4 className="fw-bold mb-2">Join the Team!</h4>
                    <p className="text-muted mb-4">
                        You have been invited to join <strong>{invite.team_name}</strong> as an <strong>{invite.role}</strong>.
                    </p>

                    <div className="alert alert-light border rounded-3 p-3 text-start small mb-4">
                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">Invitation Sent To:</span>
                            <span className="fw-semibold">{invite.email}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span className="text-muted">Role Assigned:</span>
                            <span className="fw-semibold text-capitalize">{invite.role}</span>
                        </div>
                    </div>

                    <div className="alert alert-info border-0 rounded-3 text-start small mb-4">
                        💡 <strong>Note:</strong> You can be a member of only one team at a time. Accepting this invite will assign you to this team.
                    </div>

                    <div className="d-flex gap-3 justify-content-center">
                        <button onClick={handleDecline} className="btn btn-outline-danger px-4 py-2 rounded-3 d-flex align-items-center gap-2">
                            <XCircle size={16} /> Decline
                        </button>
                        <button onClick={handleConfirm} className="btn btn-primary text-white px-4 py-2 rounded-3 d-flex align-items-center gap-2">
                            <CheckCircle size={16} /> Accept Invitation
                        </button>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
