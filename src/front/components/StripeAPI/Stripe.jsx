import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useMemo } from 'react';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51TBhDSFuSwVHOn66LY2PErKBaEAv09Zi4HukhvAYsYrXA9hcVwmLTzcEEOJR7VIJ28qfmJUzdsBwV4vGnVGdEosq00vUC1aJSD');

export default function StripeCheckout({ children }) {
  const options = useMemo(() => ({
    mode: 'payment',
    amount: 10000, // Monto en centavos ($100)
    currency: 'usd',
  }), []);

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
