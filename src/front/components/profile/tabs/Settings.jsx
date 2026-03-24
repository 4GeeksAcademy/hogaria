import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Settings = ({ user }) => {
    const navigate = useNavigate();
    const userType = localStorage.getItem("user_type");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem("user_id");

    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        name: "",
        address: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const cargarDatos = async () => {
            const endpoint = userType === "company" ? `/api/company-profile?company_id=${userId}` : `/api/profile?user_id=${userId}`;
            try {
                const response = await fetch(`${backendUrl}${endpoint}`, {
                    headers: { "Authorization": `Bearer ${token}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    setFormData(prev => ({
                        ...prev,
                        email: data.email || "",
                        phone: data.phone || "",
                        name: data.name || "",
                        address: data.address || "",
                    }));
                }
            } catch (error) {
                console.error("Error al cargar datos:", error);
            }
        };
        if (userId) cargarDatos();
    }, [userId, userType, backendUrl, token]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        const apiPath = userType === "company" 
            ? `/api/company/update?user_id=${userId}` 
            : `/api/user/profile?user_id=${userId}`;

        const datosAEnviar = {
            email: formData.email,
            phone: formData.phone,
            ...(userType === "company" && { name: formData.name, address: formData.address })
        };

        try {
            const response = await fetch(`${backendUrl}${apiPath}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(datosAEnviar),
            });

            if (response.ok) {
                alert("Perfil actualizado correctamente");
            } else {
                alert("Error al actualizar el perfil");
            }
        } catch (error) {
            alert("Error de conexión");
        } finally {
            setLoading(false);
        }
    };


    const handleChangePassword = async (e) => {
        e.preventDefault();
        
        if (formData.newPassword !== formData.confirmPassword) {
            return alert("Las contraseñas no coinciden");
        }

        try {
            const response = await fetch(`${backendUrl}/api/user/change-password?user_id=${userId}&user_type=${userType}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    current_password: formData.currentPassword,
                    new_password: formData.newPassword,
                }),
            });

            if (response.ok) {

                setFormData({ ...formData, currentPassword: "", newPassword: "", confirmPassword: "" });
                
                alert("Contraseña actualizada con éxito. Por seguridad, inicia sesión de nuevo.");

                localStorage.removeItem("token");
                localStorage.setItem("user_type", "");
                localStorage.setItem("user_id", "");

                navigate("/login");

                window.location.reload();

            } else {
                alert("La contraseña actual es incorrecta");
            }
        } catch (error) {
            alert("Error al cambiar la contraseña");
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="my-3">Configuración de cuenta</h2>
            
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-success text-white">
                    <h5 className="mb-0">{userType === "company" ? "Datos de Empresa" : "Datos Personales"}</h5>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleUpdateProfile}>
                        {userType === "company" && (
                            <div className="mb-3">
                                <label className="form-label fw-bold">Nombre Comercial</label>
                                <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                            </div>
                        )}
                        <div className="mb-3">
                            <label className="form-label fw-bold">Email</label>
                            <input type="email" className="form-control" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Teléfono</label>
                            <input type="text" className="form-control" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                        </div>
                        <button type="submit" className="btn btn-success px-4" disabled={loading}>
                            {loading ? "Guardando..." : "Guardar cambios"}
                        </button>
                    </form>
                </div>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-header bg-warning">
                    <h5 className="mb-0">Seguridad y Contraseña</h5>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleChangePassword}>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Contraseña Actual</label>
                            <input type="password" password="currentPassword" className="form-control" value={formData.currentPassword} onChange={(e) => setFormData({...formData, currentPassword: e.target.value})} required />
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Nueva Contraseña</label>
                                <input type="password" password="newPassword" className="form-control" value={formData.newPassword} onChange={(e) => setFormData({...formData, newPassword: e.target.value})} required />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Confirmar Nueva Contraseña</label>
                                <input type="password" password="confirmPassword" className="form-control" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary px-4">Actualizar contraseña</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;