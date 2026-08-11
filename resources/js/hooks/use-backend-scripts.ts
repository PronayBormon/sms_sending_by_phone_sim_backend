import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { initBackendScripts } from '@/lib/backend-scripts';

/**
 * Re-run backend template JS after Inertia renders sidebar, navbar, and dropdowns.
 */
export function useBackendScripts(): void {
    useEffect(() => {
        const run = () => {
            requestAnimationFrame(() => {
                initBackendScripts();
            });
        };

        run();

        const removeFinishListener = router.on('finish', run);

        return () => {
            removeFinishListener();
        };
    }, []);
}
