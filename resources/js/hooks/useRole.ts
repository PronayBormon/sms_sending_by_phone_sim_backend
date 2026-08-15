import { usePage } from '@inertiajs/react';

/**
 * Returns the current user's team role from shared Inertia props.
 * Possible values: 'owner' | 'admin' | 'editor' | 'viewer' | null
 */
export function useRole(): string | null {
    const { auth } = usePage<{ auth: { teamRole: string | null } }>().props;
    return auth?.teamRole ?? null;
}

/**
 * Returns true when the user is a viewer (read-only).
 * Use this to conditionally hide edit/delete buttons.
 */
export function useIsViewer(): boolean {
    return useRole() === 'viewer';
}
