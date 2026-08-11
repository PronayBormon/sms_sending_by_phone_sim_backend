import { Head, router, useForm } from "@inertiajs/react";
import EditorComponent from '@/pages/widget/editor';
import ImageUpload from '@/pages/widget/image-upload';
import { useMemo } from 'react';
import MainLayout from "@/layouts/main-layout";


interface Props {
    setting: any;
}

export default function System({
    setting,
}: Props) {
    const { data, setData, processing, post } =
        useForm({
            site_name:
                setting?.site_name || '',

            site_email:
                setting?.site_email || '',

            site_phone:
                setting?.site_phone || '',

            site_address:
                setting?.site_address || '',

            timezone:
                setting?.timezone || '',

            currency:
                setting?.currency || '',

            maintenance_mode:
                setting?.maintenance_mode || false,

            light_logo: null as File | null,

            dark_logo: null as File | null,

            favicon: null as File | null,

            meta_title:
                setting?.meta_title || '',

            meta_description:
                setting?.meta_description || '',

            facebook:
                setting?.facebook || '',

            twitter:
                setting?.twitter || '',

            linkedin:
                setting?.linkedin || '',

            instagram:
                setting?.instagram || '',

            footer_text:
                setting?.footer_text || '',

            copyright_text:
                setting?.copyright_text || '',
        });

    const submit = (
        e: React.FormEvent
    ) => {
        e.preventDefault();
        router.post('/admin/settings/system/update', data, {
            onSuccess: () => {
                // reset();
                // console.log(data);
            },
        },);

    };

    return (
        <>
            <div className="card bg-white border border-white rounded-10 p-20 mb-4">
                <div className="mb-20">
                    <h3 className="mb-1 fs-22">
                        System Settings
                    </h3>

                    <p className="fs-16 lh-1-8">
                        Manage application settings,
                        branding and configurations.
                    </p>
                </div>

                <form onSubmit={submit}>
                    <div className="row">
                        {/* Site Name */}
                        <div className="col-lg-6">
                            <div className="mb-20">
                                <label className="label fs-16 mb-2">
                                    Site Name
                                </label>

                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="site_name"
                                        placeholder="Site Name"
                                        value={data.site_name}
                                        onChange={(e) =>
                                            setData(
                                                'site_name',
                                                e.target.value
                                            )
                                        }
                                    />

                                    <label htmlFor="site_name">
                                        Site Name
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="col-lg-6">
                            <div className="mb-20">
                                <label className="label fs-16 mb-2">
                                    Site Email
                                </label>

                                <div className="form-floating">
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="site_email"
                                        placeholder="Email"
                                        value={data.site_email}
                                        onChange={(e) =>
                                            setData(
                                                'site_email',
                                                e.target.value
                                            )
                                        }
                                    />

                                    <label htmlFor="site_email">
                                        Site Email
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="col-lg-6">
                            <div className="mb-20">
                                <label className="label fs-16 mb-2">
                                    Phone Number
                                </label>

                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="site_phone"
                                        placeholder="Phone"
                                        value={data.site_phone}
                                        onChange={(e) =>
                                            setData(
                                                'site_phone',
                                                e.target.value
                                            )
                                        }
                                    />

                                    <label htmlFor="site_phone">
                                        Phone Number
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="col-lg-6">
                            <div className="mb-20">
                                <label className="label fs-16 mb-2">
                                    Address
                                </label>

                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="site_address"
                                        placeholder="Address"
                                        value={data.site_address}
                                        onChange={(e) =>
                                            setData(
                                                'site_address',
                                                e.target.value
                                            )
                                        }
                                    />

                                    <label htmlFor="site_address">
                                        Address
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Timezone
                        <div className="col-lg-6">
                            <div className="mb-20">
                                <label className="label fs-16 mb-2">
                                    Timezone
                                </label>

                                <div className="form-floating">
                                    <select
                                        className="form-select form-control"
                                        value={data.timezone}
                                        onChange={(e) =>
                                            setData(
                                                'timezone',
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="UTC">
                                            UTC
                                        </option>

                                        <option value="Asia/Dhaka">
                                            Asia/Dhaka
                                        </option>

                                        <option value="Asia/Kolkata">
                                            Asia/Kolkata
                                        </option>
                                    </select>

                                    <label>
                                        Timezone
                                    </label>
                                </div>
                            </div>
                        </div>

                        Currency
                        <div className="col-lg-6">
                            <div className="mb-20">
                                <label className="label fs-16 mb-2">
                                    Currency
                                </label>

                                <div className="form-floating">
                                    <select
                                        className="form-select form-control"
                                        value={data.currency}
                                        onChange={(e) =>
                                            setData(
                                                'currency',
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="USD">
                                            USD
                                        </option>

                                        <option value="BDT">
                                            BDT
                                        </option>

                                        <option value="EUR">
                                            EUR
                                        </option>
                                    </select>

                                    <label>
                                        Currency
                                    </label>
                                </div>
                            </div>
                        </div> */}

                        {/* Maintenance */}
                        <div className="col-lg-12">
                            <div className="mb-20">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="maintenance_mode"
                                        checked={
                                            data.maintenance_mode
                                        }
                                        onChange={(e) =>
                                            setData(
                                                'maintenance_mode',
                                                e.target.checked
                                            )
                                        }
                                    />

                                    <label
                                        className="form-check-label"
                                        htmlFor="maintenance_mode"
                                    >
                                        Enable Maintenance
                                        Mode
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Light Logo */}
                        <div className="col-lg-4">
                            <ImageUpload
                                label="Light Logo"
                                file={data.light_logo}
                                imageUrl={
                                    setting?.light_logo
                                        ? `/${setting.light_logo}`
                                        : ''
                                }
                                onChange={(file) =>
                                    setData('light_logo', file)
                                }
                            />
                        </div>

                        {/* Dark Logo */}
                        <div className="col-lg-4">
                            <ImageUpload
                                label="Dark Logo"
                                file={data.dark_logo}
                                imageUrl={
                                    setting?.dark_logo
                                        ? `/${setting.dark_logo}`
                                        : ''
                                }
                                onChange={(file) =>
                                    setData('dark_logo', file)
                                }
                                previewBackground="#0f172a"
                                previewClassName="text-white"
                            />
                        </div>

                        {/* Favicon */}
                        <div className="col-lg-4">
                            <ImageUpload
                                label="Favicon"
                                file={data.favicon}
                                imageUrl={
                                    setting?.favicon
                                        ? `/${setting.favicon}`
                                        : ''
                                }
                                onChange={(file) =>
                                    setData('favicon', file)
                                }
                                height="180px"
                            />
                        </div>

                        {/* Meta Title */}
                        <div className="col-lg-12">
                            <div className="mb-20">
                                <label className="label fs-16 mb-2">
                                    Meta Title
                                </label>

                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Meta Title"
                                        value={data.meta_title}
                                        onChange={(e) =>
                                            setData(
                                                'meta_title',
                                                e.target.value
                                            )
                                        }
                                    />

                                    <label>
                                        Meta Title
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Meta Description */}
                        <div className="col-lg-12">
                            <div className="mb-20">
                                <label className="label fs-16 mb-2">
                                    Meta Description
                                </label>

                                <EditorComponent
                                    value={
                                        data.meta_description
                                    }
                                    onChange={(value) =>
                                        setData(
                                            'meta_description',
                                            value
                                        )
                                    }
                                />
                            </div>
                        </div>

                        {/* Socials */}
                        <div className="col-lg-12">
                            <div className="mb-20">
                                <h3 className="fs-22">
                                    Social Profiles
                                </h3>
                            </div>
                        </div>

                        {[
                            'facebook',
                            'twitter',
                            'linkedin',
                            'instagram',
                        ].map((social) => (
                            <div
                                className="col-lg-6"
                                key={social}
                            >
                                <div className="mb-20">
                                    <label className="label fs-16 mb-2 text-capitalize">
                                        {social}
                                    </label>

                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={
                                                data[
                                                social as keyof typeof data
                                                ] as string
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    social as any,
                                                    e.target
                                                        .value
                                                )
                                            }
                                        />

                                        <label>
                                            {social}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Footer Text */}
                        <div className="col-lg-12">
                            <div className="mb-20">
                                <label className="label fs-16 mb-2">
                                    Footer Text
                                </label>

                                <EditorComponent
                                    value={
                                        data.footer_text
                                    }
                                    onChange={(value) =>
                                        setData(
                                            'footer_text',
                                            value
                                        )
                                    }
                                />
                            </div>
                        </div>


                        {/* Address */}
                        <div className="col-lg-12">
                            <div className="mb-20">
                                <label className="label fs-16 mb-2">
                                    Copyright text
                                </label>

                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="copyright"
                                        placeholder="Copyright "
                                        value={data.copyright_text}
                                        onChange={(e) =>
                                            setData(
                                                'copyright_text',
                                                e.target.value
                                            )
                                        }
                                    />

                                    <label htmlFor="copyright_text">
                                        Copyright text
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="col-lg-12">
                            <div className="d-flex gap-2">
                                <button
                                    type="submit"
                                    className="btn btn-primary fw-normal text-white"
                                    disabled={processing}
                                >
                                    Save Settings
                                </button>

                                <button
                                    type="reset"
                                    className="btn btn-danger fw-normal text-white"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}
