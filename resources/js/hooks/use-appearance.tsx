// Dark mode functionality has been removed
export type Appearance = 'light';

export function initializeTheme() {
    // Light mode only
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
}

export function useAppearance() {
    const appearance: Appearance = 'light';
    const updateAppearance = () => {
        // No-op: only light mode is supported
    };

    return { appearance, updateAppearance } as const;
}

