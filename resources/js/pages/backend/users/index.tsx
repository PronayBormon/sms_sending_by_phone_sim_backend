import MainLayout from "@/layouts/main-layout";
import { Head, router, useForm, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";


interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar: string;
    role: string;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface UsersPagination {
    data: User[];
    links: PaginationLink[];
}

interface Props {
    users: UsersPagination;

    filters: {
        search?: string;
        join_date?: string;
    };
}



export default function Index({ users, filters }: Props) {

    const [editId, setEditId] = useState<number | null>(null);

    const [search, setSearch] = useState(
        filters.search || ''
    );

    const [joinDate, setJoinDate] = useState(
        filters.join_date || ''
    );

    const { data, setData, post, processing, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        avatar: '',
    });

    const submit = (e: React.FormEvent) => {

        e.preventDefault();

        if (editId) {

            router.put(`/admin/users/${editId}`, data, {
                onSuccess: () => {
                    reset();
                    setEditId(null);
                },
            });

        } else {

            post('/admin/users', {
                onSuccess: () => {
                    reset();
                },
            });
        }
    };

    const editUser = (user: User) => {

        setEditId(user.id);

        setData({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: '',
        });
    };

    const deleteUser = (id: number) => {

        Swal.fire({
            title: "Clear Logs?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, clear logs",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/users/${id}`, {
                    onSuccess: () => {
                        // Swal.fire({
                        //     icon: "success",
                        //     title: "Success",
                        //     text: "Logs cleared successfully.",
                        //     timer: 1500,
                        //     showConfirmButton: false,
                        // });
                    },

                });

            }
        });
    };

    const applyFilters = () => {

        router.get(
            '/admin/users',
            {
                search,
                join_date: joinDate,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const resetFilters = () => {

        setSearch('');

        setJoinDate('');

        router.get('/admin/users');
    };

    useEffect(() => {

        const timeout = setTimeout(() => {

            router.get(
                '/admin/users',
                {
                    search,
                    join_date: joinDate,
                },
                {
                    preserveState: true,
                    replace: true,
                }
            );

        }, 500);

        return () => clearTimeout(timeout);

    }, [search, joinDate]);

    return (
        <>
            <Head title="User List" />

            <div
                className="main-content-container overflow-hidden"
                style={{ minHeight: "75vh" }}
            >

                <div className="row">

                    <div className="col-md-12">
                        <div className="card bg-white rounded-10 border border-white mb-4">

                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-20">

                                <Link className="bg-transparent text-primary fs-16 border-0 p-0" href={'/admin/users/create'}>
                                    + Add New User
                                </Link>
                                {/* <button
                                    className="bg-transparent text-primary fs-16 border-0 p-0"
                                    data-bs-target="#exampleModal"
                                    data-bs-toggle="modal"
                                    onClick={() => {

                                        setEditId(null);

                                        reset();
                                    }}
                                >

                                    + Add New User

                                </button> */}

                                {/* Filters */}

                                <div className="d-flex align-items-center gap-2 flex-wrap">

                                    <input
                                        className="form-control"
                                        placeholder="Search by name or email"
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        style={{ width: '250px' }}
                                    />

                                    <input
                                        className="form-control"
                                        type="date"
                                        value={joinDate}
                                        onChange={(e) =>
                                            setJoinDate(e.target.value)
                                        }
                                        style={{ width: '250px' }}
                                    />

                                    <button
                                        className="btn btn-primary text-white"
                                        onClick={applyFilters}
                                    >

                                        Filter

                                    </button>

                                    <button
                                        className="btn btn-secondary"
                                        onClick={resetFilters}
                                    >

                                        Reset

                                    </button>

                                </div>

                            </div>

                            <div className="default-table-area mx-minus-1 table-to-do-list">

                                <div className="table-responsive">

                                    <table className="table align-middle w-100">

                                        <thead>

                                            <tr>

                                                <th>
                                                    User ID
                                                </th>

                                                <th>
                                                    Name
                                                </th>

                                                <th>
                                                    Email
                                                </th>

                                                <th>
                                                    Role
                                                </th>

                                                <th>
                                                    Join Date
                                                </th>

                                                <th className="text-end">
                                                    Action
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {users.data.length > 0 ? (

                                                users.data.map((user) => (

                                                    <tr key={user.id}>

                                                        <td>
                                                            #{user.id}
                                                        </td>

                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <div className="flex-shrink-0">
                                                                    <img alt="user15" className="rounded-circle" src={user.avatar ? `/${user.avatar}` : "/backend/assets/images/placholder.png"} style={{ width: "35px", height: "35px" }} />
                                                                </div>
                                                                <div className="flex-grow-1 ms-12">
                                                                    <h4 className="fw-medium fs-16 mb-0">
                                                                        {user.first_name} {user.last_name}
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td>
                                                            {user.email}
                                                        </td>
                                                        <td>
                                                            <span
                                                                className={
                                                                    user.role === 'admin' || user.role === 'super_admin'
                                                                        ? 'badge bg-primary'
                                                                        : 'badge bg-secondary'
                                                                }
                                                            >
                                                                {user.role
                                                                    ? user.role
                                                                        .replace('_', ' ')
                                                                        .replace(/\b\w/g, (char) => char.toUpperCase())
                                                                    : 'User'}
                                                            </span>
                                                        </td>

                                                        <td>
                                                            {new Date(
                                                                user.created_at
                                                            ).toLocaleDateString(
                                                                'en-US',
                                                                {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                }
                                                            )}
                                                        </td>

                                                        <td>

                                                            <div
                                                                className="d-flex justify-content-end"
                                                                style={{ gap: "12px" }}
                                                            >

                                                                <Link
                                                                    className="bg-transparent p-0 border-0 hover-text-success"
                                                                    href={`/admin/user/show/${user.id}`}
                                                                >
                                                                    <i className="material-symbols-outlined fs-16 fw-normal text-body">
                                                                        Visibility
                                                                    </i>
                                                                </Link>

                                                                <Link
                                                                    className="bg-transparent p-0 border-0 hover-text-success"
                                                                    href={`/admin/user/edit/${user.id}`}
                                                                >
                                                                    <i className="material-symbols-outlined fs-16 fw-normal text-primary">
                                                                        edit
                                                                    </i>
                                                                </Link>

                                                                <button
                                                                    onClick={() =>
                                                                        deleteUser(user.id)
                                                                    }
                                                                    className="bg-transparent p-0 border-0 hover-text-danger"
                                                                >

                                                                    <i className="material-symbols-outlined fs-16 fw-normal text-danger">
                                                                        delete
                                                                    </i>

                                                                </button>

                                                            </div>

                                                        </td>

                                                    </tr>

                                                ))

                                            ) : (

                                                <tr>

                                                    <td
                                                        colSpan={5}
                                                        className="text-center py-5"
                                                    >

                                                        No users found

                                                    </td>

                                                </tr>

                                            )}

                                        </tbody>

                                    </table>

                                </div>

                                {/* Pagination */}

                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 pt-20 p-20">

                                    <span className="fs-14 text-muted">

                                        Showing {users.data.length} users

                                    </span>

                                    <ul className="pagination mb-0">

                                        {users.links.map((link, index) => (

                                            <li
                                                key={index}
                                                className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}
                                            >

                                                <button
                                                    type="button"
                                                    className="page-link"
                                                    disabled={!link.url}
                                                    onClick={() => {

                                                        if (link.url) {

                                                            router.visit(link.url, {
                                                                preserveState: true,
                                                                preserveScroll: true,
                                                            });
                                                        }
                                                    }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
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