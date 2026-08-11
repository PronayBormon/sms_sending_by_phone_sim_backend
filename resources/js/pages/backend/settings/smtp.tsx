
import { Head, router, useForm } from "@inertiajs/react";

interface Props {
    mailer: string;
    host: string;
    port: string;
    username: string;
    password: string;
    encryption: string;
    from_email: string;
    from_name: string;
}

export default function smtp({
    mailer,
    host,
    port,
    username,
    password,
    encryption,
    from_email,
    from_name,
}: Props) {
    const { data, setData, processing, post } =
        useForm({
            mailer: mailer || '',
            host: host || '',
            port: port || '',
            username: username || '',
            password: password || '',
            encryption: encryption || '',
            from_email: from_email || '',
            from_name: from_name || '',
        });


    const submit = (
        e: React.FormEvent
    ) => {
        e.preventDefault();
        router.post('/admin/settings/smtp/update', data, {
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
                        SMTP Settings
                    </h3>

                    <p className="fs-16 lh-1-8">
                        SMTP (Simple Mail Transfer Protocol) settings route outgoing emails from your client or application to the server.
                    </p>
                </div>

                <form onSubmit={submit}>
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="mb-20">
                                <label className="label fs-16 mb-2">
                                    SMTP Mailer
                                </label>

                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="mailer"
                                        placeholder="mailer"
                                        value={data.mailer}
                                        onChange={(e) =>
                                            setData('mailer', e.target.value)
                                        }
                                    />

                                    <label htmlFor="mailer">
                                        mailer
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="mb-20">
                                <label className="label fs-16 mb-2">
                                    SMTP Host
                                </label>

                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="host"
                                        placeholder="SMTP Host"
                                        value={data.host}
                                        onChange={(e) =>
                                            setData('host', e.target.value)
                                        }
                                    />

                                    <label htmlFor="host">
                                        SMTP Host
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="mb-20">
                                <label className="label fs-16 mb-2">
                                    SMTP Port
                                </label>

                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="port"
                                        placeholder="SMTP Port"
                                        value={data.port}
                                        onChange={(e) =>
                                            setData('port', e.target.value)
                                        }
                                    />

                                    <label htmlFor="port">
                                        SMTP Port
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="mb-20">
                                <label className="label fs-16 mb-2">
                                    SMTP Username
                                </label>

                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        placeholder="SMTP Username"
                                        value={data.username}
                                        onChange={(e) =>
                                            setData('username', e.target.value)
                                        }
                                    />

                                    <label htmlFor="username">
                                        SMTP Username
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="mb-20">
                                <label className="label fs-16 mb-2">
                                    SMTP Password
                                </label>

                                <div className="form-floating">
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="SMTP Password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                    />

                                    <label htmlFor="password">
                                        SMTP Password
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="mb-20">
                                <label className="label fs-16 mb-2">
                                    Encryption
                                </label>

                                <div className="form-floating">
                                    <select
                                        className="form-select"
                                        id="encryption"
                                        value={data.encryption}
                                        onChange={(e) =>
                                            setData('encryption', e.target.value)
                                        }
                                    >
                                        <option value="">Select</option>
                                        <option value="tls">TLS</option>
                                        <option value="ssl">SSL</option>
                                    </select>

                                    <label htmlFor="encryption">
                                        Encryption
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="mb-20">
                                <label className="label fs-16 mb-2">
                                    From Email
                                </label>

                                <div className="form-floating">
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="from_email"
                                        placeholder="From Email"
                                        value={data.from_email}
                                        onChange={(e) =>
                                            setData('from_email', e.target.value)
                                        }
                                    />

                                    <label htmlFor="from_email">
                                        From Email
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="mb-20">
                                <label className="label fs-16 mb-2">
                                    From Name
                                </label>

                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="from_name"
                                        placeholder="From Name"
                                        value={data.from_name}
                                        onChange={(e) =>
                                            setData('from_name', e.target.value)
                                        }
                                    />

                                    <label htmlFor="from_name">
                                        From Name
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
                                Save SMTP Settings
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}