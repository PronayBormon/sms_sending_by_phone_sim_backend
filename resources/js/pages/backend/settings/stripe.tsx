
import { Head, router, useForm } from "@inertiajs/react";

interface Props {
    publishable_key: string;
    secret_key: string;
}

export default function smtp({
    publishable_key,
    secret_key,
}: Props) {
    const { data, setData, processing, post } =
        useForm({
            publishable_key: publishable_key || '',
            secret_key: secret_key || '',
        });


    const submit = (
        e: React.FormEvent
    ) => {
        e.preventDefault();
        router.post('/admin/settings/stripe/update', data, {
            onSuccess: () => {
                // reset();
                console.log(data);
            },
        },);

    };


    return (
        <>
            <div className="card bg-white border border-white rounded-10 p-20 mb-4">
                <div className="mb-20">
                    <h3 className="mb-1 fs-22">
                        Stripe Settings
                    </h3>

                    {/* <p className="fs-16 lh-1-8">
                        SMTP (Simple Mail Transfer Protocol) settings route outgoing emails from your client or application to the server.
                    </p> */}
                </div>

                <form onSubmit={submit} className="" style={{minHeight: "60vh"}}>
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="mb-20">
                                <label className="label fs-16 mb-2">
                                    Stripe publishable key
                                </label>

                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="publishable_key"
                                        placeholder="Stripe publishable Key"
                                        value={data.publishable_key}
                                        onChange={(e) =>
                                            setData('publishable_key', e.target.value)
                                        }
                                    />

                                    <label htmlFor="publishable_key">
                                        Stripe publishable Key
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="mb-20">
                                <label className="label fs-16 mb-2">
                                    Stripe Secret Key
                                </label>

                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="secret_key"
                                        placeholder="Stripe Secret key"
                                        value={data.secret_key}
                                        onChange={(e) =>
                                            setData('secret_key', e.target.value)
                                        }
                                    />

                                    <label htmlFor="secret_key">
                                        Stripe Secret key
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="col-12">
                            <button
                                type="submit"
                                className="btn btn-primary text-white"
                                disabled={processing}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}