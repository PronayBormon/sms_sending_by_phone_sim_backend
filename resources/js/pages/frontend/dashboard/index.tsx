import React from 'react';
import UserLayout from '@/layouts/user-layout';
import { Head, router } from '@inertiajs/react';
import { Send, Users, Activity, MessageSquare } from 'lucide-react';
import Chart from 'react-apexcharts';

interface Invitation {
    id: number;
    token: string;
    role: string;
    team: {
        id: number;
        team_name: string;
    };
    creator?: {
        first_name: string;
        last_name: string;
        email: string;
    };
}

interface Props {
    invitations: Invitation[];
}

const Index = ({ invitations }: Props) => {
    const stats = [
        { title: 'Total Messages Sent', value: '45,231', icon: Send, color: 'text-primary', bg: 'bg-primary-subtle' },
        { title: 'Active Contacts', value: '12,094', icon: Users, color: 'text-success', bg: 'bg-success-subtle' },
        { title: 'Delivery Rate', value: '98.5%', icon: Activity, color: 'text-info', bg: 'bg-info-subtle' },
        { title: 'Campaigns Running', value: '4', icon: MessageSquare, color: 'text-warning', bg: 'bg-warning-subtle' },
    ];

    const chartOptions = {
        chart: {
            type: 'area',
            toolbar: { show: false },
            fontFamily: 'Inter, sans-serif',
        },
        colors: ['#4361ee'],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        xaxis: {
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yaxis: {
            labels: {
                formatter: (val: number) => {
                    return val + "k"
                }
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.05,
                stops: [0, 90, 100]
            }
        }
    };

    const chartSeries = [{
        name: 'Messages Sent',
        data: [3.1, 4.0, 2.8, 5.1, 4.2, 10.9, 10.0]
    }];

    return (
        <UserLayout title="Overview">
            <Head title="Dashboard" />

            {/* Pending Team Invitations */}
            {invitations && invitations.length > 0 && (
                <div className="mb-4">
                    <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                        <Users size={18} className="text-primary" /> Pending Team Invitations
                    </h5>
                    <div className="row g-3">
                        {invitations.map((inv) => (
                            <div className="col-12 col-md-6" key={inv.id}>
                                <div className="card border-0 shadow-sm rounded-4 p-3 bg-light">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="fw-bold mb-1">Invitation to join "{inv.team?.team_name || 'Team'}"</h6>
                                            <p className="small mb-0 text-muted">
                                                Role: <span className="text-capitalize fw-semibold">{inv.role}</span>
                                                {inv.creator && ` • Invited by ${inv.creator.first_name} ${inv.creator.last_name}`}
                                            </p>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button 
                                                onClick={() => router.post(`/team/accept/${inv.token}/decline`)} 
                                                className="btn btn-sm btn-outline-danger rounded-3"
                                            >
                                                Decline
                                            </button>
                                            <button 
                                                onClick={() => router.get(`/team/accept/${inv.token}`)} 
                                                className="btn btn-sm btn-primary text-white rounded-3"
                                            >
                                                View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="row justify-content-center mb-4">
                {stats.map((stat, index) => (
                    <div className="col-lg-3 col-md-6 col-sm-6 mb-4" key={index}>
                        <div className="card border-0 shadow-sm rounded-4 h-100 p-4 transition-transform hover-scale">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div>
                                    <span className="text-muted fw-semibold fs-14">{stat.title}</span>
                                    <h3 className="mb-0 mt-1 fw-bold fs-24">{stat.value}</h3>
                                </div>
                                <div className={`d-flex align-items-center justify-content-center rounded-circle p-3 ${stat.bg} ${stat.color}`} style={{ width: '56px', height: '56px' }}>
                                    <stat.icon size={24} />
                                </div>
                            </div>
                            <div className="d-flex align-items-center gap-1">
                                <span className="badge bg-success-subtle text-success rounded-pill px-2 py-1">+5.2%</span>
                                <span className="text-muted fs-13 ms-1">from last week</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row">
                <div className="col-lg-8 mb-4">
                    <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0">Delivery Overview</h5>
                            <select className="form-select form-select-sm w-auto shadow-none border-1">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                                <option>This Year</option>
                            </select>
                        </div>
                        {typeof window !== 'undefined' && (
                            <Chart options={chartOptions as any} series={chartSeries} type="area" height={320} />
                        )}
                    </div>
                </div>

                <div className="col-lg-4 mb-4">
                    <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                        <h5 className="fw-bold mb-4">Recent Campaigns</h5>

                        <div className="d-flex flex-column gap-4">
                            {[
                                { name: 'Summer Promo', status: 'Completed', date: 'Today, 09:30 AM', color: 'success' },
                                { name: 'Welcome Series', status: 'Active', date: 'Ongoing', color: 'primary' },
                                { name: 'Re-engagement', status: 'Paused', date: 'Yesterday, 14:00 PM', color: 'warning' },
                                { name: 'Flash Sale Alert', status: 'Draft', date: '2 days ago', color: 'secondary' }
                            ].map((campaign, i) => (
                                <div key={i} className="d-flex align-items-center">
                                    <div className={`bg-${campaign.color}-subtle p-2 rounded me-3`}>
                                        <MessageSquare className={`text-${campaign.color}`} size={20} />
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="mb-0 fw-semibold">{campaign.name}</h6>
                                        <small className="text-muted">{campaign.date}</small>
                                    </div>
                                    <div>
                                        <span className={`badge bg-${campaign.color}-subtle text-${campaign.color} rounded-pill`}>{campaign.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto pt-4 text-center">
                            <a href="#" className="text-primary fw-medium text-decoration-none">View All Campaigns &rarr;</a>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .hover-scale { transition: transform 0.3s ease, box-shadow 0.3s ease; }
                .hover-scale:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important; }
            `}</style>
        </UserLayout>
    );
};

export default Index;
