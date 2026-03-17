import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './CheckoutForm.css';

export default function CheckoutForm({ amount = 100, productName = 'Servicio' }) {
  const navigate = useNavigate();
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
      setError('Error: Stripe no está cargado correctamente');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Primero: validar y enviar el formulario
      const submitResult = await elements.submit();
      console.log('Elements submit result:', submitResult);

      // submitResult.error existe solo si hay un error real
      if (submitResult?.error) {
        const errorMessage = submitResult.error.message || 'Error en validación desconocido';
        setError(`Error en validación: ${errorMessage}`);
        setLoading(false);
        console.error('Submit error:', submitResult.error);
        return;
      }

      // Segundo: confirmar el pago
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setError(`Error de Stripe: ${error.message}`);
        setLoading(false);
        console.error('Stripe error:', error);
      } else if (paymentIntent) {
        console.log('Payment Intent status:', paymentIntent.status);
        if (paymentIntent.status === 'succeeded') {
          setSuccess(true);
          setLoading(false);
        } else if (paymentIntent.status === 'processing') {
          setError('Tu pago está siendo procesado...');
          setLoading(false);
        } else if (paymentIntent.status === 'requires_action') {
          setError('Se requiere acción adicional para completar el pago');
          setLoading(false);
        } else {
          setError(`Estado del pago: ${paymentIntent.status}`);
          setLoading(false);
        }
      }
    } catch (err) {
      setError(`Error inesperado: ${err.message}`);
      setLoading(false);
      console.error('Checkout error:', err);
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

      <div className="button-group">
        <button
          type="submit"
          disabled={!stripe || loading || !clientSecret}
          className="submit-button"
        >
          {loading ? 'Procesando pago...' : `Pagar $${amount / 100}`}
        </button>
        <button
          type="button"
          onClick={() => navigate('/cancel')}
          className="cancel-button"
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
