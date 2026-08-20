import React, { useState } from 'react';
import UserLayout from '@/layouts/user-layout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { confirmAction } from '@/utils/confirm';
import { Search, Filter, Pencil, Trash } from 'lucide-react';

interface User {
    id: number;
    first_name: string | null;
    last_name: string | null;
    email: string;
    avatar: string | null;
}

interface Member {
    id: number;
    user: User | null;
    invited_email: string | null;
    role: string;
    status: string;
    last_active_at: string | null;
}

interface ActivityLog {
    id: number;
    user: { id: number; first_name: string; last_name: string } | null;
    action: string;
    subject: string;
    created_at: string;
}

interface Props {
    members: Member[];
    team_id: string;
    activityLogs: {
        data: ActivityLog[];
        current_page: number;
        last_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
}

const roleColors: Record<string, string> = {
    owner: 'bg-primary text-white',
    admin: 'bg-info text-white',
    editor: 'bg-success text-white',
    viewer: 'bg-warning text-dark',
};

const statusColors: Record<string, string> = {
    active: 'bg-success-subtle text-success',
    invited: 'bg-info-subtle text-info',
};

function getInitials(member: Member): string {
    if (member.user) {
        const f = member.user.first_name?.[0] || '';
        const l = member.user.last_name?.[0] || '';
        return (f + l).toUpperCase() || '?';
    }
    return (member.invited_email?.[0] || '?').toUpperCase();
}

function getDisplayName(member: Member): string {
    if (member.user) {
        return [member.user.first_name, member.user.last_name].filter(Boolean).join(' ') || member.user.email;
    }
    return member.invited_email || 'Unknown';
}

function getEmail(member: Member): string {
    return member.user?.email || member.invited_email || '';
}

function timeAgo(dateStr: string | null): string {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
}

const avatarColors = ['#4f46e5', '#0891b2', '#059669', '#d97706', '#dc2626', '#7c3aed', '#db2777'];
function getAvatarColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return avatarColors[Math.abs(hash) % avatarColors.length];
}

export default function Index({ members, activityLogs, team_id }: Props) {
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [editingRoleId, setEditingRoleId] = useState<number | null>(null);

    const inviteForm = useForm({ email: '', role: 'editor' });
    const roleForm = useForm({ role: '' });
    const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);

    const createTeamForm = useForm({
        name: '',
    });


    const createTeam = (e: React.FormEvent) => {
        e.preventDefault();

        createTeamForm.post('/user/team/create', {
            preserveScroll: true,
            onSuccess: () => {
                setShowCreateTeamModal(false);
                createTeamForm.reset();
            },
        });
    };

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        inviteForm.post('/user/team/invite', {
            onSuccess: () => {
                setShowInviteModal(false);
                inviteForm.reset();
            },
        });
    };

    const handleRoleUpdate = (member: any, newRole: string) => {
        roleForm.setData('role', newRole);
        router.put(`/user/team/member/${member.id}/role`, { role: newRole, is_invite: member.is_invite }, {
            preserveScroll: true,
            onSuccess: () => setEditingRoleId(null),
        });
    };

    const handleRemove = async (member: any) => {
        const msg = member.is_invite ? 'Are you sure you want to cancel this invitation?' : 'Are you sure you want to remove this member?';
        const ok = await confirmAction({ text: msg, confirmText: 'Yes, proceed' });
        if (ok) {
            router.delete(`/user/team/create`, {
                data: { is_invite: member.is_invite },
                preserveScroll: true
            });
        }
    };

    return (
        <UserLayout title="Team Management">
            <Head title="Team Management" />

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <p className="text-muted mb-0">{members.length} member{members.length !== 1 ? 's' : ''}</p>
                </div>
                {team_id == null ? (
                    <button
                        className="btn btn-primary rounded-3 d-flex align-items-center gap-2"
                        onClick={() => setShowCreateTeamModal(true)}
                    >
                        <span>+</span> Create Team
                    </button>
                ) : (
                    <button
                        className="btn btn-primary rounded-3 d-flex align-items-center gap-2"
                        onClick={() => setShowInviteModal(true)}
                    >
                        <span>+</span> Invite Member
                    </button>
                )}

            </div>



            {/* Members Table */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr className="text-uppercase small text-muted">
                                    <th className="px-4 py-3 fw-semibold" style={{ letterSpacing: '0.05em' }}>Member</th>
                                    <th className="py-3 fw-semibold" style={{ letterSpacing: '0.05em' }}>Role</th>
                                    <th className="py-3 fw-semibold" style={{ letterSpacing: '0.05em' }}>Status</th>
                                    <th className="py-3 fw-semibold" style={{ letterSpacing: '0.05em' }}>Last Active</th>
                                    <th className="px-4 py-3 fw-semibold text-end" style={{ letterSpacing: '0.05em' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.map((member) => {
                                    const isOwner = member.role === 'owner';
                                    const initials = getInitials(member);
                                    const name = getDisplayName(member);
                                    const email = getEmail(member);
                                    const color = getAvatarColor(name);

                                    return (
                                        <tr key={member.id}>
                                            <td className="px-4">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div
                                                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                                                        style={{ width: 40, height: 40, backgroundColor: color, fontSize: '0.85rem' }}
                                                    >
                                                        {initials}
                                                    </div>
                                                    <div>
                                                        <div className="fw-semibold">{name}</div>
                                                        <div className="text-muted small">{email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {editingRoleId === member.id ? (
                                                    <select
                                                        className="form-select form-select-sm w-auto"
                                                        defaultValue={member.role}
                                                        onChange={(e) => handleRoleUpdate(member, e.target.value)}
                                                        onBlur={() => setEditingRoleId(null)}
                                                        autoFocus
                                                    >
                                                        <option value="admin">Admin</option>
                                                        <option value="editor">Editor</option>
                                                        <option value="viewer">Viewer</option>
                                                    </select>
                                                ) : (
                                                    <span className={`badge rounded-pill px-3 py-2 ${roleColors[member.role] || 'bg-secondary'}`}>
                                                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`badge rounded-pill px-3 py-2 ${statusColors[member.status] || 'bg-secondary-subtle text-secondary'}`}>
                                                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="text-muted">
                                                {member.status === 'active' ? timeAgo(member.last_active_at) : 'Never'}
                                            </td>
                                            <td className="px-4 text-end">
                                                {isOwner ? (
                                                    <span className="text-muted">—</span>
                                                ) : (
                                                    <div className="d-flex gap-2 justify-content-end">
                                                        <button
                                                            className="btn btn-sm btn-light text-primary p-2"
                                                            onClick={() => setEditingRoleId(member.id)}
                                                        >
                                                            <Pencil size={"16px"} />
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-light text-danger p-2"
                                                            onClick={() => handleRemove(member)}
                                                        >
                                                            <Trash size={"16px"} />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Activity Log */}
            {activityLogs.total > 0 && (
                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center">
                        <h5 className="fw-bold mb-0">Recent Team Activity</h5>
                        <small className="text-muted">{activityLogs.total} total events</small>
                    </div>
                    <div className="card-body p-4">
                        <div className="d-flex flex-column gap-3">
                            {activityLogs.data.map((log) => (
                                <div key={log.id} className="d-flex justify-content-between align-items-start pb-3 border-bottom">
                                    <div>
                                        <span className="fw-semibold">{log.user ? `${log.user.first_name} ${log.user.last_name}` : 'System'}</span>
                                        <span className="text-muted ms-2">{log.action} <span className="fw-medium">"{log.subject}"</span></span>
                                    </div>
                                    <small className="text-muted flex-shrink-0 ms-3">{timeAgo(log.created_at)}</small>
                                </div>
                            ))}
                        </div>
                    </div>
                    {activityLogs.last_page > 1 && (
                        <div className="card-footer bg-white border-top p-3">
                            <div className="d-flex align-items-center justify-content-between">
                                <small className="text-muted">Page {activityLogs.current_page} of {activityLogs.last_page}</small>
                                <ul className="pagination pagination-sm mb-0">
                                    {activityLogs.links.map((link, index) => (
                                        <li key={index} className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}>
                                            <Link
                                                className="page-link"
                                                href={link.url || '#'}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Invite Modal */}
            {showInviteModal && (
                <>
                    <div className="modal-backdrop fade show" onClick={() => setShowInviteModal(false)}></div>
                    <div className="modal fade show d-block" tabIndex={-1}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow rounded-4">
                                <div className="modal-header border-0 p-4 pb-0">
                                    <h5 className="modal-title fw-bold">Invite Team Member</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowInviteModal(false)}></button>
                                </div>
                                <div className="modal-body p-4">
                                    <form onSubmit={handleInvite}>
                                        <div className="mb-3">
                                            <label className="form-label">Email Address *</label>
                                            <input
                                                type="email"
                                                className={`form-control ${inviteForm.errors.email ? 'is-invalid' : ''}`}
                                                value={inviteForm.data.email}
                                                onChange={(e) => inviteForm.setData('email', e.target.value)}
                                                placeholder="name@example.com"
                                                required
                                            />
                                            {inviteForm.errors.email && <div className="invalid-feedback">{inviteForm.errors.email}</div>}
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label">Role *</label>
                                            <select
                                                className="form-select"
                                                value={inviteForm.data.role}
                                                onChange={(e) => inviteForm.setData('role', e.target.value)}
                                            >
                                                <option value="admin">Admin</option>
                                                <option value="editor">Editor</option>
                                                <option value="viewer">Viewer</option>
                                            </select>
                                        </div>
                                        <div className="d-flex justify-content-end gap-2">
                                            <button type="button" className="btn btn-light" onClick={() => setShowInviteModal(false)}>Cancel</button>
                                            <button type="submit" className="btn btn-primary" disabled={inviteForm.processing}>
                                                {inviteForm.processing ? 'Sending...' : 'Send Invitation'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Team create modal  */}
            {showCreateTeamModal && (
                <>
                    <div
                        className="modal-backdrop fade show"
                        onClick={() => setShowCreateTeamModal(false)}
                    />

                    <div
                        className="modal fade show d-block"
                        tabIndex={-1}
                        role="dialog"
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow rounded-4">

                                <div className="modal-header">
                                    <h5 className="modal-title fw-bold">
                                        Create Team
                                    </h5>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowCreateTeamModal(false)}
                                    />
                                </div>

                                <form onSubmit={createTeam}>
                                    <div className="modal-body">

                                        <label className="form-label fw-semibold">
                                            Team Name
                                        </label>

                                        <input
                                            type="text"
                                            className={`form-control ${createTeamForm.errors.name
                                                ? 'is-invalid'
                                                : ''
                                                }`}
                                            placeholder="Enter team name"
                                            value={createTeamForm.data.name}
                                            onChange={(e) =>
                                                createTeamForm.setData(
                                                    'name',
                                                    e.target.value
                                                )
                                            }
                                            autoFocus
                                        />

                                        {createTeamForm.errors.name && (
                                            <div className="invalid-feedback">
                                                {createTeamForm.errors.name}
                                            </div>
                                        )}

                                    </div>

                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-light"
                                            onClick={() => {
                                                setShowCreateTeamModal(false);
                                                createTeamForm.reset();
                                            }}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={createTeamForm.processing}
                                        >
                                            {createTeamForm.processing
                                                ? 'Creating...'
                                                : 'Create Team'}
                                        </button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </>
            )}

        </UserLayout>
    );
}
