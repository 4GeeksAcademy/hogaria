import { useState, useEffect } from "react";

const PaymentMethods = ({ userId }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/payment-methods?user_id=${userId}`,
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setPaymentMethods(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchPaymentMethods();
  }, [userId]);

  if (loading) return <p>Cargando métodos de pago...</p>;

  return (
    <div className="payment-methods">
      <h5>Métodos de Pago</h5>
      <button className="btn btn-success mb-3">
        <i className="fas fa-plus"></i> Agregar Método de Pago
      </button>

      {paymentMethods.length === 0 ? (
        <p className="text-muted">No tienes métodos de pago agregados aún</p>
      ) : (
        <div className="payment-list">
          {paymentMethods.map((method) => (
            <div key={method.id} className="card mb-3">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h6 className="card-title">{method.type}</h6>
                    <p className="card-text"><strong>Titular:</strong> {method.holder_name}</p>
                    {method.last_four && (
                      <p className="card-text"><strong>Últimos 4 dígitos:</strong> ••••{method.last_four}</p>
                    )}
                  </div>
                  <div className="col-md-4 text-end">
                    {method.is_default && (
                      <span className="badge bg-success mb-2">Por defecto</span>
                    )}
                    <div className="mt-2">
                      <button className="btn btn-sm btn-outline-primary me-2">Editar</button>
                      <button className="btn btn-sm btn-outline-danger">Eliminar</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;