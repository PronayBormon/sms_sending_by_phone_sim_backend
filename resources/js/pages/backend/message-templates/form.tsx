import { Link, useForm } from '@inertiajs/react';
import Select from 'react-select';

interface Option { id: number; team_name?: string; first_name?: string; last_name?: string; }
interface Template { id: number; team_id: number | null; creator_id: number | null; template_type: 'private' | 'public'; title: string; sub_title: string | null; message: string; variables: string[] | null; is_active: boolean; }

export default function MessageTemplateForm({ template, teams, users }: { template?: Template; teams: Option[]; users: Option[] }) {
    const { data, setData, post, put, transform, processing, errors } = useForm({
        team_id: template?.team_id?.toString() ?? '', creator_id: template?.creator_id?.toString() ?? '',
        template_type: template?.template_type ?? 'private', title: template?.title ?? '', sub_title: template?.sub_title ?? '',
        message: template?.message ?? '', variablesText: template?.variables?.join(', ') ?? '', is_active: template?.is_active ?? true,
    });
    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        transform((formData) => ({ ...formData, variables: formData.variablesText.split(',').map((value) => value.trim()).filter(Boolean) }));
        if (template) put(`/admin/message-templates/${template.id}`);
        else post('/admin/message-templates');
    };
    const fieldError = (field: keyof typeof errors) => errors[field] && <div className="text-danger mt-1">{errors[field]}</div>;
    return <form onSubmit={submit}><div className="row">
        <div className="col-lg-8"><div className="card bg-white p-20 rounded-10 border border-white mb-4">
            <div className="mb-20"><label className="label fs-16 mb-2">Template Title</label><input required className="form-control" value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="e.g. Appointment reminder" />{fieldError('title')}</div>
            <div className="mb-20"><label className="label fs-16 mb-2">Subtitle</label><input className="form-control" value={data.sub_title} onChange={(e) => setData('sub_title', e.target.value)} placeholder="Optional internal description" />{fieldError('sub_title')}</div>
            <div className="mb-20"><label className="label fs-16 mb-2">SMS Message</label><textarea required className="form-control" rows={8} maxLength={1600} value={data.message} onChange={(e) => setData('message', e.target.value)} placeholder="Hi {{name}}, your appointment is tomorrow at {{time}}." />
                <div className="text-muted fs-13 mt-1">{data.message.length}/1600 characters</div>{fieldError('message')}</div>
            <div className="mb-0"><label className="label fs-16 mb-2">Variables</label><input className="form-control" value={data.variablesText} onChange={(e) => setData('variablesText', e.target.value)} placeholder="name, time (comma-separated)" /></div>
        </div></div>
        <div className="col-lg-4"><div className="card bg-white p-20 rounded-10 border border-white mb-4"><h3 className="mb-20">Settings</h3>
            <div className="mb-20"><label className="label fs-16 mb-2">Template Type</label><select className="form-select" value={data.template_type} onChange={(e) => setData('template_type', e.target.value as 'private' | 'public')}><option value="private">Private</option><option value="public">Public</option></select>{fieldError('template_type')}</div>
            <div className="mb-20"><label className="label fs-16 mb-2">Team</label><Select isClearable options={teams.map((team) => ({ value: String(team.id), label: team.team_name ?? '' }))} value={teams.find((team) => String(team.id) === data.team_id) ? { value: data.team_id, label: teams.find((team) => String(team.id) === data.team_id)?.team_name ?? '' } : null} onChange={(option) => setData('team_id', option?.value ?? '')} placeholder="Select Team" styles={{ control: (base) => ({ ...base, minHeight: '45px', borderColor: '#e2e8f0' }) }} />{fieldError('team_id')}</div>
            <div className="mb-20"><label className="label fs-16 mb-2">Creator</label><Select isClearable options={users.map((user) => ({ value: String(user.id), label: `${user.first_name} ${user.last_name}` }))} value={users.find((user) => String(user.id) === data.creator_id) ? { value: data.creator_id, label: (() => { const user = users.find((item) => String(item.id) === data.creator_id)!; return `${user.first_name} ${user.last_name}`; })() } : null} onChange={(option) => setData('creator_id', option?.value ?? '')} placeholder="Select Creator" styles={{ control: (base) => ({ ...base, minHeight: '45px', borderColor: '#e2e8f0' }) }} />{fieldError('creator_id')}</div>
            <div className="form-check mb-20"><input id="is_active" className="form-check-input" type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} /><label htmlFor="is_active" className="form-check-label">Active template</label></div>
            <div className="d-flex gap-2"><button className="btn btn-primary text-white" disabled={processing}>{template ? 'Update Template' : 'Create Template'}</button><Link href="/admin/message-templates" className="btn btn-secondary">Cancel</Link></div>
        </div></div>
    </div></form>;
}
