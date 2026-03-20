import { useState, useEffect } from "react";
import Modal from "../../Modal/Modal";
import FormularioMetodoPago from "../../PaymentForm/FormularioMetodoPago";

const PaymentMethods = ({ userId }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  useEffect(() => {
    if (userId) {
      fetchPaymentMethods();
    }
  }, [userId]);

  const handleMethodSaved = () => {
    fetchPaymentMethods();
    setEditingMethod(null);
  };

  const handleEdit = (method) => {
    setEditingMethod(method);
    setIsModalOpen(true);
  };

  const handleDelete = async (methodId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este método de pago?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const backendUrl = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '');
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${backendUrl}/api/user/payment-methods/${methodId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        console.log('✅ Método de pago eliminado');
        fetchPaymentMethods();
      } else {
        const data = await response.json();
        alert(`Error al eliminar: ${data.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error eliminando método:', error);
      alert('Error al eliminar el método de pago');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMethod(null);
  };

  if (loading) return <p>Cargando métodos de pago...</p>;

  return (
    <div className="payment-methods">
      <h5>Métodos de Pago</h5>
      <button
        className="btn btn-success mb-3"
        onClick={() => {
          setEditingMethod(null);
          setIsModalOpen(true);
        }}
      >
        <i className="fas fa-plus"></i> Agregar Método de Pago
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingMethod ? "Editar Método de Pago" : "Agregar Nuevo Método de Pago"}
      >
        <FormularioMetodoPago
          userId={userId}
          method={editingMethod}
          onClose={handleCloseModal}
          onSaved={handleMethodSaved}
        />
      </Modal>

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
                    <div>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(method)}
                        disabled={isDeleting}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(method.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Eliminando...' : 'Eliminar'}
                      </button>
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