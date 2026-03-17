import { useNavigate } from 'react-router-dom';
import '../styles/cancel.css';

export const Cancel = () => {
    const navigate = useNavigate();

    return (
        <div className="cancel-container">
            <div className="cancel-content">
                <div className="cancel-icon">✕</div>

                <h1>Pago Cancelado</h1>

                <p className="cancel-message">
                    Tu pago ha sido cancelado. No se ha realizado ningún cargo en tu tarjeta.
                </p>

                <div className="cancel-details">
                    <p>
                        Si cancelaste deliberadamente, puedes intentar de nuevo cuando estés listo.
                        Si tuviste problemas, contáctanos para más ayuda.
                    </p>
                </div>

                <div className="cancel-actions">
                    <button onClick={() => navigate('/checkout')} className="btn-primary">
                        Intentar de Nuevo
                    </button>
                    <button onClick={() => navigate('/')} className="btn-secondary">
                        Volver al Inicio
                    </button>
                    <button onClick={() => navigate('/support')} className="btn-tertiary">
                        Contactar Soporte
                    </button>
                </div>
            </div>
        </div>
    );
};
