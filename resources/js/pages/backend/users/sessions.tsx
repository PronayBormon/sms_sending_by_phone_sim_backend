import { Head, Link } from '@inertiajs/react';

export default function Sessions({ user, sessions }) {
    return (
        <>
            <Head title={'Session-' + user.name} />

            <div
                className="main-content-container overflow-hidden"
                style={{ minHeight: "75vh" }}
            >

                <div className="row">

                    <div className="col-md-12">
                        <div className="card bg-white rounded-10 border border-white mb-4">

                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-20">

                                <h4>Sessions</h4>
                                <Link
                                    href={`/admin/user/show/${user.id}`}
                                    className="bg-transparent text-primary fs-16 border-0 p-0">
                                    Back
                                </Link>



                            </div>

                            <div className="default-table-area mx-minus-1 table-to-do-list">

                                <div className="table-responsive">

                                    <table className="table align-middle w-100">

                                        <thead>

                                            <tr>

                                                <th>
                                                    Device
                                                </th>

                                                <th>
                                                    Platform
                                                </th>

                                                <th>
                                                    Browser
                                                </th>

                                                <th>
                                                    IP Address
                                                </th>

                                                <th>
                                                    Last Activity
                                                </th>

                                            </tr>

                                        </thead>
                                        <tbody>
                                            {sessions && sessions.length > 0 ? (
                                                sessions.map((session) => (
                                                    <tr key={session.id}>
                                                        <td>{session.device}</td>
                                                        <td>{session.platform}</td>
                                                        <td>{session.browser}</td>
                                                        <td>{session.ip_address}</td>
                                                        <td>
                                                            {new Date(
                                                                session.last_activity * 1000
                                                            ).toLocaleString()}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="text-center">
                                                        No data available
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}