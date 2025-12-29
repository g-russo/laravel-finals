import { useFlashMessages } from '@/hooks/use-flash-messages';

/**
 * FlashToastHandler component that listens for Laravel flash messages
 * and displays them as toast notifications.
 * 
 * This component must be placed inside the Inertia component tree (e.g., in layouts).
 * The Toaster component is rendered in app.tsx, this just handles the flash messages.
 */
export function FlashToastHandler() {
    // Hook that listens for flash messages and displays them as toasts
    useFlashMessages();
    
    return null;
}
