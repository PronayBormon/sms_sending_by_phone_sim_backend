import { useState, useEffect } from 'react';
import { Card } from '../../../../components/ui/card';
import { LiveDot } from '../../../../components/ui/live-dot';
import UserLayout from '@/layouts/user-layout';


const makeItem = (time: string, campaign: string, device: string, sim: string, phone: string, status: string) =>
    ({ time, campaign, device, sim, phone, status })

const initialItems = [
    makeItem('15:32:10', 'August Promotion', 'Galaxy A15', 'SIM 1', '+8801612345678', 'Sent'),
    makeItem('15:32:11', 'August Promotion', 'Galaxy A15', 'SIM 2', '+8801812345678', 'Sent'),
    makeItem('15:32:12', 'August Promotion', 'Galaxy A15', 'SIM 2', '+8801912345678', 'Failed'),
    makeItem('15:32:13', 'August Promotion', 'Galaxy A24', 'SIM 1', '+8801312345678', 'Sent'),
    makeItem('15:32:14', 'Ramadan Promotion', 'Galaxy A24', 'SIM 2', '+8801412345678', 'Sent'),
    makeItem('15:32:15', 'Customer Reminder', 'Galaxy S23', 'SIM 1', '+8801512345678', 'Sent'),
    makeItem('15:32:16', 'August Promotion', 'Galaxy A15', 'SIM 1', '+8801712345678', 'Sent'),
    makeItem('15:32:17', 'Customer Reminder', 'Galaxy S23', 'SIM 2', '+8801012345678', 'Failed'),
]

export default function GatewayActivity() {
    const [items, setItems] = useState(initialItems)
    const [deviceFilter, setDeviceFilter] = useState('All')

    useEffect(() => {
        const phones = ['+8801612300001', '+8801712300002', '+8801812300003', '+8801912300004']
        const devs = ['Galaxy A15', 'Galaxy A24', 'Galaxy S23', 'Galaxy A54']
        const sims = ['SIM 1', 'SIM 2']
        const campaigns = ['August Promotion', 'Ramadan Promotion', 'Customer Reminder']
        const statuses = ['Sent', 'Sent', 'Sent', 'Failed']

        const interval = setInterval(() => {
            const now = new Date()
            const t = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
            setItems(prev => [makeItem(
                t,
                campaigns[Math.floor(Math.random() * campaigns.length)],
                devs[Math.floor(Math.random() * devs.length)],
                sims[Math.floor(Math.random() * sims.length)],
                phones[Math.floor(Math.random() * phones.length)],
                statuses[Math.floor(Math.random() * statuses.length)],
            ), ...prev.slice(0, 49)])
        }, 1500)
        return () => clearInterval(interval)
    }, [])

    const devices = ['All', 'Galaxy A15', 'Galaxy A24', 'Galaxy S23', 'Galaxy A54']
    const filtered = deviceFilter === 'All' ? items : items.filter(i => i.device === deviceFilter)

    return (
        <UserLayout>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-[20px] font-bold text-slate-900">Gateway Activity</h2>
                    <p className="text-[13px] text-slate-500">Real-time message delivery event stream</p>
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-green-600 font-semibold bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
                    <LiveDot />
                    Live Feed
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
                    {devices.map(d => (
                        <button
                            key={d}
                            onClick={() => setDeviceFilter(d)}
                            className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors whitespace-nowrap
                ${deviceFilter === d ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            {d}
                        </button>
                    ))}
                </div>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-[12px]">
                        <thead>
                            <tr className="border-b border-slate-100">
                                {['Time', 'Campaign', 'Device', 'SIM', 'Recipient', 'Status'].map(h => (
                                    <th key={h} className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-4 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.slice(0, 30).map((item, i) => (
                                <tr
                                    key={i}
                                    className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors"
                                    style={{ animation: i === 0 ? 'slideIn 0.2s ease-out' : undefined }}
                                >
                                    <td className="px-4 py-2.5 font-mono text-[11px] text-slate-400">{item.time}</td>
                                    <td className="px-4 py-2.5 text-slate-600">{item.campaign}</td>
                                    <td className="px-4 py-2.5 font-medium text-slate-800">{item.device}</td>
                                    <td className="px-4 py-2.5 text-slate-500">{item.sim}</td>
                                    <td className="px-4 py-2.5 font-mono text-[11px] text-slate-700">{item.phone}</td>
                                    <td className="px-4 py-2.5">
                                        <span className={`flex items-center gap-1.5 font-medium ${item.status === 'Sent' ? 'text-green-600' : 'text-red-500'}`}>
                                            {item.status === 'Sent' ? '✓' : '✕'} SMS {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </UserLayout>
    )
}

