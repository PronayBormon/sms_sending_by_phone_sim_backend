import React, { useState, useEffect, useMemo } from 'react';
import UserLayout from '@/layouts/user-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, RefreshCw, Smartphone, Download, QrCode, Wifi } from 'lucide-react';
import QRCode from "react-qr-code";

export default function ConnectDevice({ token, expiresAt }: any) {

    console.log(token, expiresAt);

    const expiresIn = useMemo(() => {
        const now = Date.now();
        const expires = new Date(expiresAt).getTime();
        return Math.floor((expires - now) / 1000);
    }, [expiresAt]);

    const [seconds, setSeconds] = useState(expiresIn);
    const [QRToken, setQR] = useState(token);

    const [QRLink, setQRLink] = useState('/storage/gateway.apk');





    useEffect(() => {
        const t = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
        return () => clearInterval(t);
    }, []);

    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');

    const steps = [
        { icon: <Download size={20} className="text-primary" />, title: 'Install the App', desc: 'Download "SMS Gateway" from Google Play Store on your Android device.' },
        { icon: <Smartphone size={20} className="text-primary" />, title: 'Open the App', desc: 'Launch the app and tap "Connect to Dashboard" on the home screen.' },
        { icon: <QrCode size={20} className="text-primary" />, title: 'Scan QR Code', desc: 'Point your camera at the QR code below to pair your device instantly.' },
    ];

    return (
        <UserLayout title="Connect Device">
            <Head title="Connect Device" />

            <div className="d-flex align-items-center gap-3 mb-4">
                <Link href={'/user/devices'} className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                    <ArrowLeft size={18} className="text-muted" />
                </Link>
                <h4 className="mb-0 fw-bold">Connect Android Device</h4>
            </div>

            <div className="row g-4" style={{ maxWidth: 900 }}>
                {/* Steps */}
                <div className="col-12 col-lg-6">
                    <h6 className="fw-bold mb-3">Follow these steps</h6>
                    <div className="d-flex flex-column gap-3">
                        {steps.map((s, i) => (
                            <div key={i} className="card border-0 shadow-sm rounded-4">
                                <div className="card-body p-4 d-flex gap-3">
                                    <div className="bg-primary-subtle rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 44, height: 44 }}>
                                        {s.icon}
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-1">Step {i + 1}: {s.title}</h6>
                                        <p className="text-muted small mb-0">{s.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* QR Code Panel */}
                <div className="col-12 col-lg-6">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-5 d-flex flex-column align-items-center text-center">

                            <div className="border border-2 rounded-4 d-flex align-items-center justify-content-center mb-4 bg-white" style={{ width: 200, height: 200, padding: 10 }}>
                                <QRCode value={QRToken} size={180} />
                            </div>

                            <p className="text-muted fw-bold small text-uppercase mb-1">Gateway Pairing Code</p>
                            <h3 className="fw-bold font-monospace mb-4 tracking-wider">{QRToken}</h3>

                            <div className="d-flex align-items-center gap-2 small text-muted mb-2">
                                <span>Expires in</span>
                                <span className={`font-monospace fw-bold fs-6 ${seconds < 60 ? 'text-danger' : 'text-dark'}`}>
                                    {mins}:{secs}
                                </span>
                            </div>
<button
    type="button"
    onClick={() => window.location.reload()}
    className="btn btn-outline-secondary btn-sm rounded-pill px-3 mb-5 d-flex align-items-center gap-2"
>
    <RefreshCw size={14} />
    Regenerate Code
</button>

                            {/* Waiting indicator */}
                            <div className="bg-light rounded-4 p-3 w-100">
                                <div className="d-flex align-items-center justify-content-center gap-2">
                                    <div className="position-relative">
                                        <Wifi size={18} className="text-primary" />
                                    </div>
                                    <span className="small fw-medium text-muted">Waiting for device...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
