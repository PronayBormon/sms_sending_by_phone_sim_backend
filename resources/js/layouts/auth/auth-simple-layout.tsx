import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full custom-card max-w-md   border-0 rounded-5 p-4">
                <div className="flex flex-col gap-8 mt-5">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="mb-1 flex h-9  items-center justify-center rounded-md" style={{width: "50%", padding: "15px"}}>
                                <AppLogoIcon />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            {/* <p className="text-center text-sm text-muted-foreground">
                                {description}
                            </p> */}
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
