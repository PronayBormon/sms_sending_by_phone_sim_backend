import React from "react";
import { usePage } from '@inertiajs/react';

import MainNavbar from "@/components/main-component/main-navbar";
import MainSidebar from "@/components/main-component/main-sidebar";
import { useBackendScripts } from "@/hooks/use-backend-scripts";
import { Toaster } from '@/components/ui/sonner';

interface Props {
    title?: string;

    description?: string;

    children?: React.ReactNode;
}

export default function MainLayout({
    title = '',
    children,
}: Props) {
    useBackendScripts();

    const page = usePage();
    const { setting } = page.props as any;

    return (<>
        <Toaster
            position="top-right"
        />
        <MainSidebar />

        {/* <!-- Start Main Content Area --> */}
        <div className="container-fluid">
            <div className="main-content d-flex flex-column">

                <MainNavbar></MainNavbar>
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4 mt-1">
                    <h3 className="mb-0">
                        {title}
                    </h3>
                </div>
                {/* <!-- End Header Area --> */}
                {children}



                {/* <!-- Start Footer Area --> */}
                <footer className="footer-area bg-white text-center rounded-10 rounded-bottom-0 mt-3">
                    <p className="fs-16 text-body">
                        © {setting.copyright_text ?? "Copyright all right reserve"}
                    </p>
                </footer>
                {/* <!-- End Footer Area --> */}


            </div >
        </div >
        {/* <!-- Start Main Content Area --> */}

    </>
    );
}
