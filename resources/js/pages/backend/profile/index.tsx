import ImageUpload from "@/pages/widget/image-upload";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

interface Props {
    user: {
        id: number;
        name: string;
        email: string;
        avatar?: string | null;
        role?: string | null;
        created_at?: string;
    };
}

export default function Index({ user }: Props) {
    const profileForm = useForm({
        name: user.name || "",
        email: user.email || "",
        avatar: null as File | null,
    });

    const passwordForm = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const avatar =
        user.avatar && user.avatar !== "null"
            ? `/${user.avatar}`
            : "/backend/assets/images/placholder.png";

    const submitProfile = (e: React.FormEvent) => {
        e.preventDefault();

        profileForm.transform((data) => ({
            ...data,
            _method: "put",
        }));

        profileForm.post("/admin/profile", {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const submitPassword = (e: React.FormEvent) => {
        e.preventDefault();

        passwordForm.put("/admin/profile/password", {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    return (
        <>
            <Head title="Edit Profile" />

            <div className="row">
                <div className="col-lg-4">
                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <div className="text-center d-flex flex-column align-items-center">
                            <img
                                src={avatar}
                                alt={user.name}
                                className="rounded-circle mb-3 border border-1"
                                style={{
                                    width: "120px",
                                    height: "120px",
                                    objectFit: "cover",
                                }}
                            />

                            <h3 className="mb-1">{user.name}</h3>

                            <p className="text-muted mb-3">{user.email}</p>

                            <span className="badge bg-primary text-capitalize fs-14">
                                {user.role ?? "user"}
                            </span>
                        </div>
                    </div>

                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <h3 className="mb-20">Account Details</h3>

                        <ul className="p-0 mb-0 list-unstyled last-child-none">
                            <li className="mb-10 fs-16">
                                User ID:{" "}
                                <span className="text-secondary">
                                    #{user.id}
                                </span>
                            </li>

                            <li className="mb-10 fs-16">
                                Role:{" "}
                                <span className="text-secondary text-capitalize">
                                    {user.role ?? "user"}
                                </span>
                            </li>

                            {user.created_at && (
                                <li className="mb-10 fs-16">
                                    Join Date:{" "}
                                    <span className="text-secondary">
                                        {new Date(
                                            user.created_at
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <h3 className="mb-20">Edit Profile</h3>

                        <form onSubmit={submitProfile}>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="mb-20">
                                        <label className="label fs-16 mb-2">
                                            Full Name
                                        </label>

                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Full name"
                                                value={profileForm.data.name}
                                                onChange={(e) =>
                                                    profileForm.setData(
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                            <label>Full name</label>
                                        </div>

                                        {profileForm.errors.name && (
                                            <div className="text-danger mt-1">
                                                {profileForm.errors.name}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-lg-6">
                                    <div className="mb-20">
                                        <label className="label fs-16 mb-2">
                                            Email Address
                                        </label>

                                        <div className="form-floating">
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="Email address"
                                                value={profileForm.data.email}
                                                onChange={(e) =>
                                                    profileForm.setData(
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                            <label>Email address</label>
                                        </div>

                                        {profileForm.errors.email && (
                                            <div className="text-danger mt-1">
                                                {profileForm.errors.email}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-lg-12">
                                    <ImageUpload
                                        label="Avatar"
                                        file={profileForm.data.avatar}
                                        imageUrl={user.avatar ? avatar : ""}
                                        onChange={(file) =>
                                            profileForm.setData("avatar", file)
                                        }
                                    />

                                    {profileForm.errors.avatar && (
                                        <div className="text-danger mt-1">
                                            {profileForm.errors.avatar}
                                        </div>
                                    )}
                                </div>

                                <div className="col-lg-12">
                                    <button
                                        type="submit"
                                        className="btn btn-primary fw-normal text-white"
                                        disabled={profileForm.processing}
                                    >
                                        Update Profile
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <h3 className="mb-20">Update Password</h3>

                        <form onSubmit={submitPassword}>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="mb-20">
                                        <label className="label fs-16 mb-2">
                                            Current Password
                                        </label>

                                        <div className="position-relative">
                                            <input
                                                type={
                                                    showCurrentPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                className="form-control pe-5"
                                                placeholder="Current password"
                                                value={
                                                    passwordForm.data
                                                        .current_password
                                                }
                                                onChange={(e) =>
                                                    passwordForm.setData(
                                                        "current_password",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                            <button
                                                type="button"
                                                className="border-0 bg-transparent position-absolute top-50 end-0 translate-middle-y me-3"
                                                onClick={() =>
                                                    setShowCurrentPassword(
                                                        !showCurrentPassword
                                                    )
                                                }
                                            >
                                                <i
                                                    className={
                                                        showCurrentPassword
                                                            ? "ri-eye-line"
                                                            : "ri-eye-off-line"
                                                    }
                                                ></i>
                                            </button>
                                        </div>

                                        {passwordForm.errors
                                            .current_password && (
                                            <div className="text-danger mt-1">
                                                {
                                                    passwordForm.errors
                                                        .current_password
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-lg-6">
                                    <div className="mb-20">
                                        <label className="label fs-16 mb-2">
                                            New Password
                                        </label>

                                        <div className="position-relative">
                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                className="form-control pe-5"
                                                placeholder="New password"
                                                value={
                                                    passwordForm.data.password
                                                }
                                                onChange={(e) =>
                                                    passwordForm.setData(
                                                        "password",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                            <button
                                                type="button"
                                                className="border-0 bg-transparent position-absolute top-50 end-0 translate-middle-y me-3"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                            >
                                                <i
                                                    className={
                                                        showPassword
                                                            ? "ri-eye-line"
                                                            : "ri-eye-off-line"
                                                    }
                                                ></i>
                                            </button>
                                        </div>

                                        {passwordForm.errors.password && (
                                            <div className="text-danger mt-1">
                                                {passwordForm.errors.password}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-lg-6">
                                    <div className="mb-20">
                                        <label className="label fs-16 mb-2">
                                            Confirm Password
                                        </label>

                                        <div className="position-relative">
                                            <input
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                className="form-control pe-5"
                                                placeholder="Confirm password"
                                                value={
                                                    passwordForm.data
                                                        .password_confirmation
                                                }
                                                onChange={(e) =>
                                                    passwordForm.setData(
                                                        "password_confirmation",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                            <button
                                                type="button"
                                                className="border-0 bg-transparent position-absolute top-50 end-0 translate-middle-y me-3"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword
                                                    )
                                                }
                                            >
                                                <i
                                                    className={
                                                        showConfirmPassword
                                                            ? "ri-eye-line"
                                                            : "ri-eye-off-line"
                                                    }
                                                ></i>
                                            </button>
                                        </div>

                                        {passwordForm.errors
                                            .password_confirmation && (
                                            <div className="text-danger mt-1">
                                                {
                                                    passwordForm.errors
                                                        .password_confirmation
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-lg-12">
                                    <button
                                        type="submit"
                                        className="btn btn-primary fw-normal text-white"
                                        disabled={passwordForm.processing}
                                    >
                                        Update Password
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
