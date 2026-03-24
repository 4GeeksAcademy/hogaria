import React, { useRef } from "react";

const UserProfileHeader = ({ user }) => {
  const fileInputRef = useRef(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem("user_id");

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch(`${backendUrl}/api/user/update-avatar?user_id=${userId}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      alert("Error al subir la imagen");
    }
  };

  return (
    <div className="profile-header bg-light py-4">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-2 text-center">
            <div 
              onClick={() => fileInputRef.current.click()} 
              style={{ cursor: "pointer", position: "relative", display: "inline-block" }}
            >
              <img
                src={user?.avatar || "https://placehold.co/150"}
                className="profile-avatar rounded-circle border shadow-sm"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
              <div className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2">
                <i className="fas fa-pencil-alt fa-xs"></i>
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} style={{ display: "none" }} accept="image/*" />
          </div>

          <div className="col-md-10">
            <h1>{user?.name || "Usuario"}</h1>
            <p className="text-muted"><i className="fas fa-envelope"></i> {user?.email}</p>
            <p className="text-muted"><i className="fas fa-phone"></i> {user?.phone || "No especificado"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;