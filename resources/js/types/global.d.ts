import type { Auth } from '@/types/auth';
import type { FlashProps } from '@/types/ui';

declare module 'react' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            flash: FlashProps;
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}

interface BootstrapDropdown {
    getOrCreateInstance: (element: Element) => unknown;
    getInstance: (element: Element) => { dispose: () => void } | null;
}

interface BootstrapTooltip {
    getInstance: (element: Element) => { dispose: () => void } | null;
    new (element: Element): unknown;
}

interface Window {
    Menu?: new (
        element: HTMLElement,
        config?: Record<string, unknown>,
    ) => { destroy: () => void };
    Helpers?: {
        scrollToActive: (animate: boolean) => void;
        mainMenu?: unknown;
    };
    SimpleBar?: new (element: HTMLElement) => { unMount: () => void };
    bootstrap?: {
        Dropdown?: BootstrapDropdown;
        Tooltip?: BootstrapTooltip;
    };
}
