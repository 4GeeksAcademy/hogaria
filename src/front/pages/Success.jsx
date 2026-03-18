import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/success.css';

export const Success = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        const redirect = setTimeout(() => {
            navigate('/');
        }, 5000);

        return () => {
            clearInterval(timer);
            clearTimeout(redirect);
        };
    }, [navigate]);

    return (
        <div className="success-container">
            <div className="success-content">
                <div className="success-icon">✓</div>

                <h1>¡Pago Exitoso!</h1>

                <p className="success-message">
                    Tu transacción ha sido procesada correctamente.
                </p>

                <div className="success-details">
                    <p>
                        Gracias por tu compra. En breve recibirás un correo de confirmación con los detalles de tu transacción.
                    </p>
                </div>

                <div className="success-actions">
                    <button onClick={() => navigate('/')} className="btn-primary">
                        Volver al Inicio
                    </button>
                    <button onClick={() => navigate('/profile')} className="btn-secondary">
                        Ir a Mi Perfil
                    </button>
                </div>

                <p className="auto-redirect">
                    Redirigiendo en {countdown}s...
                </p>
            </div>
        </div>
    );
};
