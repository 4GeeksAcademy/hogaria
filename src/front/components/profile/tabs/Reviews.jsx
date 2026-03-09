import { useState, useEffect } from "react";

const Reviews = ({ userId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Las opiniones no tienen un endpoint específico, pero podemos usar el perfil
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/profile?user_id=${userId}`,
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setReviews(data.opinions || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchReviews();
  }, [userId]);

  if (loading) return <p>Cargando valoraciones...</p>;

  return (
    <div className="reviews">
      <h5>Valoraciones</h5>
      <button className="btn btn-success mb-3">
        <i className="fas fa-star"></i> Dejar una Valoración
      </button>

      {reviews.length === 0 ? (
        <p className="text-muted">Aún no tienes valoraciones</p>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="card mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="card-title">⭐ {review.rating}/5</h6>
                    <p className="card-text">{review.comment}</p>
                  </div>
                  <small className="text-muted">Empresa ID: {review.company_id}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;