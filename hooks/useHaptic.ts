import { useCallback } from 'react';

// Simple Haptic Hook
export const useHaptic = () => {
    const trigger = useCallback((pattern: number | number[] = 10) => {
        // Check if vibration API is supported
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try {
                navigator.vibrate(pattern);
            } catch (e) {
                // Ignore errors on devices blocking vibration or without hardware
            }
        }
    }, []);

    const heavy = useCallback(() => trigger(40), [trigger]);
    const medium = useCallback(() => trigger(20), [trigger]);
    const light = useCallback(() => trigger(10), [trigger]); // For subtle clicks

    // Patterns
    const success = useCallback(() => trigger([10, 30, 10]), [trigger]);
    const error = useCallback(() => trigger([50, 30, 50, 30, 50]), [trigger]);
    const impact = useCallback(() => trigger(70), [trigger]);

    return { trigger, heavy, medium, light, success, error, impact };
};
