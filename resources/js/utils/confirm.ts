import Swal from 'sweetalert2';

interface ConfirmOptions {
    title?: string;
    text: string;
    confirmText?: string;
    cancelText?: string;
    icon?: 'warning' | 'error' | 'success' | 'info' | 'question';
}

export function confirmAction({
    title = 'Are you sure?',
    text,
    confirmText = 'Yes, proceed',
    cancelText = 'Cancel',
    icon = 'warning',
}: ConfirmOptions): Promise<boolean> {
    return Swal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        reverseButtons: true,
        customClass: {
            popup: 'rounded-4 shadow-lg',
            confirmButton: 'btn btn-danger px-4',
            cancelButton: 'btn btn-secondary px-4',
        },
        buttonsStyling: true,
    }).then((result) => result.isConfirmed);
}
