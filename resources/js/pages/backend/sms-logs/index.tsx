import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const statusClass: Record<string, string> = {
    pending: 'bg-secondary', queued: 'bg-info', sending: 'bg-primary', sent: 'bg-primary',
    delivered: 'bg-success', failed: 'bg-danger', cancelled: 'bg-dark',
};

export default function Index({ logs, filters }: any) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [status, setStatus] = useState(filters?.status ?? '');
    const [date, setDate] = useState(filters?.date ?? '');
    const apply = () => router.get('/admin/sms-logs', { search, status, date }, { preserveState: true, replace: true });
    useEffect(() => { const timer = setTimeout(apply, 500); return () => clearTimeout(timer); }, [search]);
    const reset = () => { setSearch(''); setStatus(''); setDate(''); router.get('/admin/sms-logs'); };

    return <><Head title="SMS Logs" /><div className="main-content-container overflow-hidden" style={{ minHeight: '75vh' }}><div className="row"><div className="col-md-12"><div className="card bg-white rounded-10 border border-white mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-20"><span className="text-primary fs-16">SMS Delivery Logs</span><div className="d-flex align-items-center gap-2 flex-wrap"><input className="form-control" style={{ width: '230px' }} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Recipient, sender, or gateway ID" /><select className="form-select" style={{ width: '150px' }} value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option>{['pending', 'queued', 'sending', 'sent', 'delivered', 'failed', 'cancelled'].map((item) => <option key={item} value={item}>{item.charAt(0).toUpperCase() + item.slice(1)}</option>)}</select><input className="form-control" style={{ width: '160px' }} type="date" value={date} onChange={(event) => setDate(event.target.value)} /><button className="btn btn-primary text-white" onClick={apply}>Filter</button><button className="btn btn-secondary" onClick={reset}>Reset</button></div></div>
        <div className="default-table-area mx-minus-1 table-to-do-list"><div className="table-responsive"><table className="table align-middle w-100"><thead><tr><th>Log ID</th><th>Recipient</th><th>Message</th><th>Campaign / Device</th><th>SIM</th><th>Status</th><th>Attempts</th><th>Created</th></tr></thead><tbody>{logs.data.length ? logs.data.map((log: any) => <tr key={log.id}><td>#{log.id}<small className="d-block text-muted">{log.gateway_message_id || 'No gateway ID'}</small></td><td><span className="fw-medium">{log.recipient}</span><small className="d-block text-muted">From: {log.sender || '—'}</small></td><td><span title={log.message}>{log.message.length > 70 ? `${log.message.slice(0, 70)}…` : log.message}</span>{log.error_message && <small className="d-block text-danger">{log.error_message}</small>}</td><td>{log.campaign?.campaign_name || '—'}<small className="d-block text-muted">{log.device?.name || 'No device'}</small></td><td>{log.sim_slot ? `Slot ${log.sim_slot}` : '—'}</td><td><span className={`badge ${statusClass[log.status] || 'bg-secondary'} text-capitalize`}>{log.status}</span></td><td>{log.attempts}</td><td>{new Date(log.created_at).toLocaleString()}</td></tr>) : <tr><td colSpan={8} className="text-center py-5">No SMS logs found</td></tr>}</tbody></table></div><div className="d-flex justify-content-between align-items-center flex-wrap gap-3 pt-20 p-20"><span className="fs-14 text-muted">Showing {logs.data.length} logs</span><ul className="pagination mb-0">{logs.links?.map((link: any, index: number) => <li key={index} className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}><button className="page-link" disabled={!link.url} onClick={() => link.url && router.visit(link.url, { preserveState: true, preserveScroll: true })} dangerouslySetInnerHTML={{ __html: link.label }} /></li>)}</ul></div></div>
    </div></div></div></div></>;
}
