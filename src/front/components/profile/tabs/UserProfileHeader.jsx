const UserProfileHeader = ({ user }) => {
  return (
    <div className="profile-header bg-light py-4">
      <div className="container">
        <div className="row align-items-center">
          {/* Avatar */}
          <div className="col-md-2 text-center">
            <img
              src={user?.avatar || "https://via.placeholder.com/150"}
              alt={user?.name || "Usuario"}
              className="profile-avatar rounded-circle"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
          </div>

          {/* Datos Personales */}
          <div className="col-md-10">
            <h1>{user?.name || "Usuario"}</h1>
            <p className="text-muted">
              <i className="fas fa-envelope"></i> {user?.email}
            </p>
            <p className="text-muted">
              <i className="fas fa-phone"></i> {user?.phone || "No especificado"}
            </p>
            {user?.created_at && (
              <p className="text-muted">
                Miembro desde: {new Date(user.created_at).toLocaleDateString("es-ES")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;