import { useState, useEffect } from "react";

const Opinions = ({ companyId }) => {
  const [opinions, setOpinions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpinions = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/company/${companyId}/opinions`,
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setOpinions(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (companyId) fetchOpinions();
  }, [companyId]);

  const renderStars = (rating) => {
    return (
      <div className="stars">
        {[...Array(5)].map((_, i) => (
          <i
            key={i}
            className={`fas fa-star ${i < rating ? "text-warning" : "text-muted"}`}
          ></i>
        ))}
      </div>
    );
  };

  if (loading) return <p>Cargando opiniones...</p>;

  return (
    <div className="opinions-section">
      {opinions.length === 0 ? (
        <p className="text-muted">No hay opiniones aún</p>
      ) : (
        <div className="opinions-list">
          {opinions.map((opinion) => (
            <div key={opinion.id} className="opinion-card card mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="card-subtitle mb-2">Usuario ID: {opinion.user_id}</h6>
                    <div className="mb-2">
                      {renderStars(opinion.rating)}
                      <span className="ms-2 text-muted">({opinion.rating}/5)</span>
                    </div>
                  </div>
                </div>
                {opinion.comment && (
                  <p className="card-text">{opinion.comment}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Opinions;