import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { stripeService } from '../services/stripeService';

const DAILY_LIMIT = 1;

export const useSubscription = () => {
    const { user } = useAuth();
    const [isPremium, setIsPremium] = useState(false);
    const [storiesCreatedToday, setStoriesCreatedToday] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSubscription = async () => {
            if (user) {
                const status = await stripeService.getSubscriptionStatus(user.id);
                setIsPremium(status?.subscription_status === 'active');
            }
            setLoading(false);
        };

        checkSubscription();
    }, [user]);

    useEffect(() => {
        // Determine stories created today from localStorage
        const today = new Date().toDateString();
        const lastReset = localStorage.getItem('dreamcast_daily_reset');

        if (lastReset !== today) {
            localStorage.setItem('dreamcast_daily_reset', today);
            localStorage.setItem('dreamcast_daily_count', '0');
            setStoriesCreatedToday(0);
        } else {
            const count = parseInt(localStorage.getItem('dreamcast_daily_count') || '0');
            setStoriesCreatedToday(count);
        }
    }, []);

    const incrementDailyCount = () => {
        const newVal = storiesCreatedToday + 1;
        setStoriesCreatedToday(newVal);
        localStorage.setItem('dreamcast_daily_count', newVal.toString());
    };

    const checkAccess = (): boolean => {
        if (isPremium) return true;
        return storiesCreatedToday < DAILY_LIMIT;
    };

    const upgradeToPremium = () => {
        setIsPremium(true);
        // Actual upgrade happens via Stripe checkout
    };

    return {
        isPremium,
        storiesCreatedToday,
        remainingFree: Math.max(0, DAILY_LIMIT - storiesCreatedToday),
        checkAccess,
        incrementDailyCount,
        upgradeToPremium,
        loading,
    };
};
