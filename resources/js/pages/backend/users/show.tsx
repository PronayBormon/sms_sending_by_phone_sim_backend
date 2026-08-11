import MainLayout from "@/layouts/main-layout";

import { Link } from "@inertiajs/react";

interface Props {
    user: any;
}

export default function Show({
    user,
}: Props) {

    const avatar =
        user.avatar &&
            user.avatar !== "null"
            ? `/${user.avatar}`
            : "/backend/assets/images/placholder.png";

    return (
        <div className="row">

            {/* Profile Card */}
            <div className="col-lg-4">




                <div className="card bg-white p-20 rounded-10 border border-white mb-4">

                    <div className="text-center" style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column"
                    }}>

                        <img
                            src={avatar}
                            alt={user.name }
                            className="rounded-circle mb-3 border border-1 d-flex justify-content-center align-items-center"
                            style={{
                                width: "120px",
                                height: "120px",
                                objectFit: "cover",
                            }}
                        />

                        <h3 className="mb-1">
                            {user.name}
                        </h3>

                        <p className="text-muted mb-3">
                            {user.email}
                        </p>

                        <span className="badge bg-primary text-capitalize fs-14">
                            {user.role ?? "user"}
                        </span>

                    </div>

                </div>

            </div>

            {/* Details */}
            <div className="col-lg-8">

                <div className="card bg-white p-20 rounded-10 border border-white mb-4">

                    <div className="d-flex justify-content-between align-items-center mb-4">

                        <h3 className="mb-0">
                            User Information
                        </h3>

                        <div className="d-flex gap-2">
                            <Link
                                href={`/admin/users/` + user.id + `/sessions`}
                                className="btn btn-info fs-16 fw-normal text-white"
                            >
                                Sessions
                            </Link>

                            <Link
                                href={`/admin/user/edit/${user.id}`}
                                className="btn btn-primary text-white"
                            >
                                Edit
                            </Link>

                            <Link
                                href="/admin/users"
                                className="btn btn-secondary"
                            >
                                Back
                            </Link>

                        </div>

                    </div>

                    <div className="row">

                        {/* Name */}
                        <div className="col-md-6 mb-4">

                            <label className="label fs-14 text-muted mb-2">
                                Full Name
                            </label>

                            <div className="form-control bg-light">
                                {user.name}
                            </div>

                        </div>

                        {/* Email */}
                        <div className="col-md-6 mb-4">

                            <label className="label fs-14 text-muted mb-2">
                                Email Address
                            </label>

                            <div className="form-control bg-light">
                                {user.email}
                            </div>

                        </div>

                        {/* Role */}
                        <div className="col-md-6 mb-4">

                            <label className="label fs-14 text-muted mb-2">
                                Role
                            </label>

                            <div>
                                <span className="badge bg-secondary text-capitalize">
                                    {user.role ?? "user"}
                                </span>
                            </div>

                        </div>

                        {/* Join Date */}
                        <div className="col-md-6 mb-4">

                            <label className="label fs-14 text-muted mb-2">
                                Joined At
                            </label>

                            <div className="form-control bg-light">
                                {new Date(
                                    user.created_at
                                ).toLocaleDateString(
                                    "en-US",
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    }
                                )}
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}