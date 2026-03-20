import { useState } from 'react';
import CheckoutForm from '../components/StripeAPI/CheckoutForm';
import StripeCheckout from '../components/StripeAPI/Stripe';
import '../styles/checkout-test.css';

export const CheckoutTest = () => {
  const [amount, setAmount] = useState(100);
  const [productName, setProductName] = useState('Servicio Premium');

  return (
    <StripeCheckout>
      <div className="checkout-test-container">
        <div className="checkout-test-content">
          <h1>🧪 Página de Prueba - Sistema de Pagos Stripe</h1>

          <div className="info-section">
            <h2>Información de Prueba</h2>
            <p>Usa estas credenciales para probar el pago:</p>

            <div className="test-credentials">
              <div className="credential-item">
                <strong>Número de Tarjeta:</strong>
                <code>4242 4242 4242 4242</code>
              </div>
              <div className="credential-item">
                <strong>Fecha de Vencimiento:</strong>
                <code>12/25</code> (cualquier fecha futura)
              </div>
              <div className="credential-item">
                <strong>CVC:</strong>
                <code>123</code> (cualquier número de 3 dígitos)
              </div>
              <div className="credential-item">
                <strong>Nombre:</strong>
                <code>Test User</code>
              </div>
            </div>
          </div>

          <div className="config-section">
            <h2>Configuración de Prueba</h2>

            <div className="form-group">
              <label htmlFor="amount">Monto a Cobrar (USD):</label>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                min="1"
                step="0.01"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="productName">Nombre del Producto:</label>
              <input
                id="productName"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="summary">
              <p><strong>Total a pagar:</strong> ${amount.toFixed(2)} USD</p>
              <p><strong>Producto:</strong> {productName}</p>
            </div>
          </div>

          <div className="checkout-section">
            <h2>Formulario de Pago</h2>
            <div className="checkout-wrapper">
              <CheckoutForm amount={amount * 100} productName={productName} />
            </div>
          </div>

          <div className="instructions-section">
            <h2>📝 Instrucciones</h2>
            <ol>
              <li>Modifica el monto y nombre del producto si lo deseas</li>
              <li>Completa el formulario de pago con los datos de prueba</li>
              <li>Haz clic en "Pagar ahora"</li>
              <li>Si todo funciona, verás un mensaje de éxito</li>
            </ol>
          </div>

          <div className="help-section">
            <h2>🆘 Casos de Prueba Adicionales</h2>
            <div className="test-cases">
              <div className="test-case">
                <strong>Tarjeta rechazada:</strong>
                <code>4000 0000 0000 0002</code>
              </div>
              <div className="test-case">
                <strong>Autenticación 3D Secure requerida:</strong>
                <code>4000 0025 0000 3155</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StripeCheckout>
  );
};
