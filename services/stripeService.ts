import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

// Stripe Price IDs (to be set in .env.local)
export const STRIPE_PRICES = {
    monthly: import.meta.env.VITE_STRIPE_PRICE_MONTHLY || 'price_monthly',
    yearly: import.meta.env.VITE_STRIPE_PRICE_YEARLY || 'price_yearly',
};

export const stripeService = {
    async createCheckoutSession(priceId: string, userId: string) {
        if (!supabase) throw new Error('Supabase not initialized');

        const { data, error } = await supabase.functions.invoke('stripe-checkout', {
            body: { priceId, userId },
        });

        if (error) throw error;
        return data;
    },

    async redirectToCheckout(priceId: string, userId: string) {
        try {
            const { sessionId, url } = await this.createCheckoutSession(priceId, userId);

            if (url) {
                // Redirect to Stripe Checkout
                window.location.href = url;
            } else {
                // Fallback: use Stripe.js redirect
                const stripe = await stripePromise;
                if (stripe && sessionId) {
                    await stripe.redirectToCheckout({ sessionId });
                }
            }
        } catch (error) {
            console.error('Stripe checkout error:', error);
            throw error;
        }
    },

    async getSubscriptionStatus(userId: string) {
        if (!supabase) return null;

        const { data, error } = await supabase
            .from('profiles')
            .select('subscription_status, subscription_plan, stripe_subscription_id')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching subscription:', error);
            return null;
        }

        return data;
    },
};
