import { router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

const lastShownAt = new Map<string, number>();

function showFlashToast(data?: FlashToast | null): void {
    if (!data?.message) {
        return;
    }

    const key = `${data.type}:${data.message}`;
    const now = Date.now();

    if ((lastShownAt.get(key) ?? 0) > now - 1000) {
        return;
    }

    lastShownAt.set(key, now);
    toast[data.type](data.message);
}

export function useFlashToast(): void {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.toast) {
            showFlashToast(flash.toast);
            return;
        }

        const sessionToast = (
            [
                ['success', flash?.success],
                ['error', flash?.error],
                ['warning', flash?.warning],
                ['info', flash?.info],
            ] as const
        ).find(([, message]) => message);

        if (sessionToast) {
            const [type, message] = sessionToast;

            if (message) {
                showFlashToast({ type, message });
            }
        }
    }, [flash]);

    useEffect(() => {
        return router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash;
            const data = flash?.toast as FlashToast | undefined;

            showFlashToast(data);
        });
    }, []);
}
