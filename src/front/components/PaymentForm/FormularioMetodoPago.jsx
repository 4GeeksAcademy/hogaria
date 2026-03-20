import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FormularioMetodoPago.css';

const FormularioMetodoPago = ({ userId, method, onClose, onSaved }) => {
    const navigate = useNavigate();
    const isEditMode = !!method;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [goToCheckout, setGoToCheckout] = useState(false);

    const [formData, setFormData] = useState({
        holder_name: '',
        card_number: '',
        expiry_month: '',
        expiry_year: '',
        cvv: '',
        is_default: false,
    });

    // Pre-rellenar datos si está en modo edición
    useEffect(() => {
        if (isEditMode && method) {
            setFormData({
                holder_name: method.holder_name || '',
                card_number: '', // No mostrar número de tarjeta por seguridad
                expiry_month: '',
                expiry_year: '',
                cvv: '',
                is_default: method.is_default || false,
            });
        }
    }, [method, isEditMode]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const validateForm = () => {
        if (!formData.holder_name.trim()) {
            setError('El nombre del titular es requerido');
            return false;
        }

        // En modo edición, la tarjeta es opcional (no cambiar si está vacía)
        if (!isEditMode) {
            if (!formData.card_number.trim() || formData.card_number.length < 13) {
                setError('Número de tarjeta inválido');
                return false;
            }
            if (!formData.expiry_month || !formData.expiry_year) {
                setError('Fecha de vencimiento requerida');
                return false;
            }
            if (!formData.cvv || formData.cvv.length < 3) {
                setError('CVV inválido');
                return false;
            }
        } else {
            // En edición, si se proporciona tarjeta, validar completamente
            if (formData.card_number.trim()) {
                if (formData.card_number.length < 13) {
                    setError('Número de tarjeta inválido');
                    return false;
                }
                if (!formData.expiry_month || !formData.expiry_year) {
                    setError('Fecha de vencimiento requerida si cambias la tarjeta');
                    return false;
                }
                if (!formData.cvv || formData.cvv.length < 3) {
                    setError('CVV inválido');
                    return false;
                }
            }
        }
        return true;
    };

    const handleSubmit = async (e, shouldGoToCheckout = false) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) return;

        setLoading(true);
        setGoToCheckout(shouldGoToCheckout);

        try {
            const payload = {
                holder_name: formData.holder_name,
                is_default: formData.is_default,
                type: 'credit_card',
            };

            // Si no es edición o si se proporciona nueva tarjeta, incluir datos de tarjeta
            if (!isEditMode || formData.card_number.trim()) {
                payload.card_number = formData.card_number;
                payload.last_four = formData.card_number.slice(-4);
                payload.expiry_month = formData.expiry_month;
                payload.expiry_year = formData.expiry_year;
                payload.cvv = formData.cvv;
            }

            console.log('📝 Enviando método de pago:', {
                isEditMode,
                userId,
                shouldGoToCheckout,
                payload
            });

            // Limpiar URL backend (remover barra final si existe)
            const backendUrl = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '');
            const token = localStorage.getItem('token');

            console.log('🔐 Token disponible:', !!token);
            console.log('🌐 Backend URL:', backendUrl);

            const url = isEditMode
                ? `${backendUrl}/api/user/payment-methods/${method.id}`
                : `${backendUrl}/api/user/payment-methods?user_id=${userId}`;

            const response = await fetch(url, {
                method: isEditMode ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(payload),
            });

            console.log('✅ Respuesta del servidor:', {
                status: response.status,
                statusText: response.statusText
            });

            if (!response.ok) {
                const data = await response.json();
                console.error('❌ Error del servidor:', data);
                throw new Error(data.error || data.msg || 'Error al guardar el método de pago');
            }

            const result = await response.json();
            console.log('✅ Método guardado exitosamente:', result);

            if (onSaved) {
                onSaved();
            }

            if (shouldGoToCheckout) {
                onClose();
                console.log('🔄 Redirigiendo a /checkout...');
                navigate('/checkout');
            } else {
                onClose();
            }
        } catch (err) {
            console.error('❌ Error en handleSubmit:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="formulario-metodo-pago">
            {error && <div className="alert alert-danger" role="alert">{error}</div>}

            <div className="form-group">
                <label htmlFor="holder_name">Nombre del Titular</label>
                <input
                    type="text"
                    id="holder_name"
                    name="holder_name"
                    value={formData.holder_name}
                    onChange={handleChange}
                    placeholder="Juan Pérez"
                    disabled={loading}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="card_number">
                    {isEditMode ? 'Nueva Tarjeta (Opcional)' : 'Número de Tarjeta'}
                </label>
                <input
                    type="text"
                    id="card_number"
                    name="card_number"
                    value={formData.card_number}
                    onChange={handleChange}
                    placeholder={isEditMode ? 'Dejar en blanco para no cambiar' : '1234 5678 9012 3456'}
                    disabled={loading}
                    maxLength="19"
                    required={!isEditMode}
                />
                {isEditMode && (
                    <small className="text-muted">Deja en blanco para mantener la tarjeta actual</small>
                )}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="expiry_month">Mes</label>
                    <select
                        id="expiry_month"
                        name="expiry_month"
                        value={formData.expiry_month}
                        onChange={handleChange}
                        disabled={loading}
                        required={!isEditMode}
                    >
                        <option value="">MM</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                            <option key={month} value={String(month).padStart(2, '0')}>
                                {String(month).padStart(2, '0')}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="expiry_year">Año</label>
                    <select
                        id="expiry_year"
                        name="expiry_year"
                        value={formData.expiry_year}
                        onChange={handleChange}
                        disabled={loading}
                        required={!isEditMode}
                    >
                        <option value="">AA</option>
                        {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        disabled={loading}
                        maxLength="4"
                        required={!isEditMode}
                    />
                </div>
            </div>

            <div className="form-group checkbox-group">
                <label htmlFor="is_default" className="checkbox-label">
                    <input
                        type="checkbox"
                        id="is_default"
                        name="is_default"
                        checked={formData.is_default}
                        onChange={handleChange}
                        disabled={loading}
                    />
                    <span>Establecer como método de pago predeterminado</span>
                </label>
            </div>

            <div className="form-actions">
                <button
                    type="submit"
                    className="btn btn-outline-primary"
                    onClick={(e) => handleSubmit(e, false)}
                    disabled={loading}
                >
                    {loading ? 'Guardando...' : isEditMode ? 'Guardar Cambios' : 'Guardar Método'}
                </button>
                {!isEditMode && (
                    <button
                        type="submit"
                        className="btn btn-success"
                        onClick={(e) => handleSubmit(e, true)}
                        disabled={loading}
                    >
                        {loading ? 'Procesando...' : 'Guardar e Ir a Checkout'}
                    </button>
                )}
            </div>
        </form>
    );
};

export default FormularioMetodoPago;
