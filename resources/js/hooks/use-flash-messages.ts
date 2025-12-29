import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface FlashMessages {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
    status?: string;
}

interface PageProps {
    flash?: FlashMessages;
    [key: string]: unknown;
}

/**
 * Hook to automatically display flash messages from Laravel as toast notifications.
 * This hook should be called once at the app root level.
 */
export function useFlashMessages() {
    const { flash } = usePage<PageProps>().props;
    const lastFlash = useRef<string | null>(null);

    useEffect(() => {
        if (!flash) return;

        // Create a unique key for the current flash messages to prevent duplicates
        const flashKey = JSON.stringify(flash);
        if (flashKey === lastFlash.current || flashKey === '{}') return;
        lastFlash.current = flashKey;

        // Display toast notifications based on flash message type
        if (flash.success) {
            toast.success(flash.success, {
                duration: 5000,
            });
        }

        if (flash.error) {
            toast.error(flash.error, {
                duration: 7000,
            });
        }

        if (flash.warning) {
            toast.warning(flash.warning, {
                duration: 6000,
            });
        }

        if (flash.info) {
            toast.info(flash.info, {
                duration: 5000,
            });
        }

        // Handle 'status' which is commonly used in Laravel (e.g., password reset)
        if (flash.status) {
            toast.success(flash.status, {
                duration: 5000,
            });
        }
    }, [flash]);
}

/**
 * Utility functions to show toast notifications programmatically
 */
export const showToast = {
    success: (message: string, options?: { duration?: number; description?: string }) => {
        toast.success(message, {
            duration: options?.duration ?? 5000,
            description: options?.description,
        });
    },
    error: (message: string, options?: { duration?: number; description?: string }) => {
        toast.error(message, {
            duration: options?.duration ?? 7000,
            description: options?.description,
        });
    },
    warning: (message: string, options?: { duration?: number; description?: string }) => {
        toast.warning(message, {
            duration: options?.duration ?? 6000,
            description: options?.description,
        });
    },
    info: (message: string, options?: { duration?: number; description?: string }) => {
        toast.info(message, {
            duration: options?.duration ?? 5000,
            description: options?.description,
        });
    },
    loading: (message: string) => {
        return toast.loading(message);
    },
    dismiss: (toastId?: string | number) => {
        toast.dismiss(toastId);
    },
    promise: <T,>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: unknown) => string);
        }
    ) => {
        return toast.promise(promise, messages);
    },
};
