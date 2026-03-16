import React, { useState, useEffect } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './CheckoutForm.css';

export default function CheckoutForm({ amount = 100, productName = 'Servicio' }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);

  // Crear sesión de checkout cuando el componente se monte
  useEffect(() => {
    const createCheckoutSession = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/create-checkout-session`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: amount,
              product_name: productName,
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Error al crear la sesión de pago');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        setError(err.message);
      }
    };

    createCheckoutSession();
  }, [amount, productName]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setSuccess(true);
        setLoading(false);
      }
    } catch (err) {
      setError('Error al procesar el pago. Intenta de nuevo.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="checkout-success">
        <h2>¡Pago exitoso!</h2>
        <p>Tu transacción ha sido procesada correctamente.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="form-group">
        <PaymentElement />
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading || !clientSecret}
        className="submit-button"
      >
        {loading ? 'Procesando pago...' : `Pagar $${amount / 100}`}
      </button>
    </form>
  );
}
