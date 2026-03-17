import { useState } from 'react';
import CheckoutForm from '../components/StripeAPI/CheckoutForm';
import '../styles/checkout.css';

export const Checkout = () => {
    const [amount, setAmount] = useState(0);
    const [productName, setProductName] = useState('');

    return (
        <div className="checkout-container">
            <div className="checkout-content">
                <h1>💳 Realizar Pago</h1>

                <div className="config-section">
                    <h2>Información de Pago</h2>

                    <div className="form-group">
                        <label htmlFor="productName">Descripción del Servicio:</label>
                        <input
                            id="productName"
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="Ej: Reserva de servicio premium"
                            className="input-field"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="amount">Monto a Pagar (USD):</label>
                        <input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            className="input-field"
                        />
                    </div>

                    {amount > 0 && productName && (
                        <div className="summary">
                            <p><strong>Total a pagar:</strong> ${amount.toFixed(2)} USD</p>
                            <p><strong>Concepto:</strong> {productName}</p>
                        </div>
                    )}
                </div>

                {amount > 0 && productName && (
                    <div className="checkout-section">
                        <h2>Formulario de Pago</h2>
                        <div className="checkout-wrapper">
                            <CheckoutForm amount={amount * 100} productName={productName} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
