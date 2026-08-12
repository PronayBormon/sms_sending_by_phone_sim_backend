import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Campaign {
    id: number;
    campaign_name: string | null;
    campaign_type: "regular" | "automated" | "ab_test";
    schedule_type: "now" | "later";
    is_draft: boolean;
    is_active: boolean;
    team?: {
        id: number;
        team_name: string;
    } | null;
    template?: {
        id: number;
        title: string;
    } | null;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface CampaignsPagination {
    data: Campaign[];
    links: PaginationLink[];
}

interface Props {
    campaigns: CampaignsPagination;
    filters?: {
        search?: string;
    };
}

export default function Index({ campaigns, filters }: Props) {
    const [search, setSearch] = useState(filters?.search || "");

    const deleteCampaign = (id: number) => {
        Swal.fire({
            title: "Delete Campaign?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete campaign",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/campaigns/${id}`);
            }
        });
    };

    const applyFilters = () => {
        router.get("/admin/campaigns", { search }, { preserveState: true, replace: true });
    };

    const resetFilters = () => {
        setSearch("");
        router.get("/admin/campaigns");
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get("/admin/campaigns", { search }, { preserveState: true, replace: true });
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <>
            <Head title="Campaigns List" />

            <div className="main-content-container overflow-hidden" style={{ minHeight: "75vh" }}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card bg-white rounded-10 border border-white mb-4">
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-20">
                                <Link className="btn btn-primary text-white" href="/admin/campaigns/create">
                                    + Create Campaign
                                </Link>

                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <input
                                        className="form-control"
                                        placeholder="Search campaign or description"
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        style={{ width: "250px" }}
                                    />
                                    <button className="btn btn-primary text-white" onClick={applyFilters}>
                                        Filter
                                    </button>
                                    <button className="btn btn-secondary" onClick={resetFilters}>
                                        Reset
                                    </button>
                                </div>
                            </div>

                            <div className="default-table-area mx-minus-1">
                                <div className="table-responsive">
                                    <table className="table align-middle w-100">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Campaign Name</th>
                                                <th>Type</th>
                                                <th>Template</th>
                                                <th>Team</th>
                                                <th>Schedule</th>
                                                <th>Status</th>
                                                <th className="text-end">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {campaigns.data && campaigns.data.length > 0 ? (
                                                campaigns.data.map((campaign) => (
                                                    <tr key={campaign.id}>
                                                        <td>#{campaign.id}</td>
                                                        <td>
                                                            <span className="fw-medium text-dark">{campaign.campaign_name || "—"}</span>
                                                        </td>
                                                        <td>
                                                            <span className="badge bg-info text-white text-capitalize">
                                                                {campaign.campaign_type ? campaign.campaign_type.replace("_", " ") : "regular"}
                                                            </span>
                                                        </td>
                                                        <td>{campaign.template?.title || "—"}</td>
                                                        <td>{campaign.team?.team_name || "—"}</td>
                                                        <td>
                                                            <span className="badge bg-light text-dark text-capitalize">
                                                                {campaign.schedule_type}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {campaign.is_draft ? (
                                                                <span className="badge bg-warning text-dark">Draft</span>
                                                            ) : campaign.is_active ? (
                                                                <span className="badge bg-success text-white">Active</span>
                                                            ) : (
                                                                <span className="badge bg-secondary text-white">Inactive</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <div className="d-flex justify-content-end gap-2">
                                                                <Link className="bg-transparent p-0 border-0" href={`/admin/campaigns/${campaign.id}`}>
                                                                    <i className="material-symbols-outlined fs-16 text-body">visibility</i>
                                                                </Link>
                                                                <Link className="bg-transparent p-0 border-0" href={`/admin/campaigns/${campaign.id}/edit`}>
                                                                    <i className="material-symbols-outlined fs-16 text-primary">edit</i>
                                                                </Link>
                                                                <button onClick={() => deleteCampaign(campaign.id)} className="bg-transparent p-0 border-0">
                                                                    <i className="material-symbols-outlined fs-16 text-danger">delete</i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={8} className="text-center py-5">
                                                        No campaigns found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-20">
                                    <span className="fs-14 text-muted">Showing {campaigns.data ? campaigns.data.length : 0} campaigns</span>
                                    <ul className="pagination mb-0">
                                        {campaigns.links?.map((link, index) => (
                                            <li key={index} className={`page-item ${link.active ? "active" : ""} ${!link.url ? "disabled" : ""}`}>
                                                <button
                                                    type="button"
                                                    className="page-link"
                                                    disabled={!link.url}
                                                    onClick={() => link.url && router.visit(link.url, { preserveState: true })}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
