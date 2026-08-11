import MainLayout from "@/layouts/main-layout";

import ImageUpload from "@/pages/widget/image-upload";

import { useForm } from "@inertiajs/react";
import { useState } from 'react';

export default function Create() {
    const {
        data,
        setData,
        processing,
        post,
        errors,
    } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
        avatar: null as File | null,
    });

    const submit = (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        post('/admin/users', {
            forceFormData: true,

            preserveScroll: true,
        });
    };

    const [showPassword, setShowPassword] =
        useState(false);

    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false);

    return (
        <div className="row">
            <div className="col-lg-8">
                <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                    <h3 className="mb-20">
                        Add User
                    </h3>

                    <form
                        onSubmit={submit}
                    >
                        <div className="row">

                            {/* Name */}
                            <div className="col-lg-6">
                                <div className="mb-20">
                                    <label className="label fs-16 mb-2">
                                        First Name
                                    </label>

                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="First name"
                                            value={
                                                data.first_name
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setData(
                                                    'first_name',
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                        />

                                        <label>
                                            User name
                                        </label>
                                    </div>

                                    {errors.first_name && (
                                        <div className="text-danger mt-1">
                                            {
                                                errors.first_name
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Name */}
                            <div className="col-lg-6">
                                <div className="mb-20">
                                    <label className="label fs-16 mb-2">
                                        Last Name
                                    </label>

                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Last name"
                                            value={
                                                data.last_name
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setData(
                                                    'last_name',
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                        />

                                        <label>
                                            Last name
                                        </label>
                                    </div>

                                    {errors.first_name && (
                                        <div className="text-danger mt-1">
                                            {
                                                errors.last_name
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Email */}
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
                                            value={
                                                data.email
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setData(
                                                    'email',
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                        />

                                        <label>
                                            Email address
                                        </label>
                                    </div>

                                    {errors.email && (
                                        <div className="text-danger mt-1">
                                            {
                                                errors.email
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Password */}
                            <div className="col-lg-6">
                                <div className="mb-20">
                                    <label className="label fs-16 mb-2">
                                        Password
                                    </label>

                                    <div className="position-relative">
                                        <input
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            className="form-control pe-5"
                                            placeholder="Password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    'password',
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
                                                        ? 'ri-eye-line'
                                                        : 'ri-eye-off-line'
                                                }
                                            ></i>
                                        </button>
                                    </div>

                                    {errors.password && (
                                        <div className="text-danger mt-1">
                                            {errors.password}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="col-lg-6">
                                <div className="mb-20">
                                    <label className="label fs-16 mb-2">
                                        Confirm Password
                                    </label>

                                    <div className="position-relative">
                                        <input
                                            type={
                                                showConfirmPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            className="form-control pe-5"
                                            placeholder="Confirm password"
                                            value={
                                                data.password_confirmation
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    'password_confirmation',
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
                                                        ? 'ri-eye-line'
                                                        : 'ri-eye-off-line'
                                                }
                                            ></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Avatar */}
                            <div className="col-lg-12">
                                <ImageUpload
                                    label="Avatar"
                                    file={
                                        data.avatar
                                    }
                                    onChange={(
                                        file
                                    ) =>
                                        setData(
                                            'avatar',
                                            file
                                        )
                                    }
                                />
                            </div>

                            {/* Submit */}
                            <div className="col-lg-12">
                                <div className="d-flex gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary fw-normal text-white"
                                        disabled={
                                            processing
                                        }
                                    >
                                        Add User
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-danger fw-normal text-white"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
                <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                    <h3 className="mb-20">
                        Role & Permission
                    </h3>

                    <div>
                        <label className="label fs-16 mb-2">
                            Role
                        </label>

                        <div className="form-floating">
                            <select
                                className="form-select form-control"
                                value={
                                    data.role
                                }
                                onChange={(
                                    e
                                ) =>
                                    setData(
                                        'role',
                                        e
                                            .target
                                            .value
                                    )
                                }
                            >
                                <option value="">
                                    Select role
                                </option>

                                <option value="admin">
                                    Admin
                                </option>

                                <option value="manager">
                                    Manager
                                </option>

                                <option value="editor">
                                    Editor
                                </option>

                                <option value="user">
                                    User
                                </option>
                            </select>

                            <label>
                                Select
                            </label>
                        </div>

                        {errors.role && (
                            <div className="text-danger mt-1">
                                {errors.role}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}