export const login = async (user, navigate) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/login`,
    {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const data = await response.json();
  if (!response.ok) {
    alert(data.error);
    return;
  }
  localStorage.setItem("token", data.access_token);
  localStorage.setItem("user_id", data.user.id);
  localStorage.setItem("user_type", data.user.user_type);

  if(data.user.user_type === "user"){
    navigate("/home");
  }else{
    navigate("/company-profile")
  }
};

export const signupUser = async (user, navigate) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/register/user`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    },
  );
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    alert(data.error);
  } else {
    alert(data.message);
    navigate("/login");
  }
};

export const signupCompany = async (company, navigate) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/register/company`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(company),
    },
  );
  const data = await response.json();
  console.log(data);

  if (!response.ok) {
    alert(data.error);
  } else {
    alert("Empresa creada correctamente");
    navigate("/login");
  }
};

export const authCheck = async (endpoint, navigate) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    navigate('/login');
  }
  return response;
};

export const createService = async (formData) => {     
  try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/company/services`, {
          method: "POST",
          headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              ...formData,
              price: parseFloat(formData.price),
              city_id: parseInt(formData.city_id)
          })
      });

      if (response.ok) {
          return ({ "msg": "Servicio creado correctamente", "success": true });
      } else {
          const error = await response.json();
          alert("Error: " + (error.error || "No se pudo crear el servicio"));
      }
  } catch (err) {
      console.error("Error:", err);
  }
}

export const editService = async (servicio) => {     
    try {
        const token = localStorage.getItem("token");
        
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/service/${servicio.id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: servicio.name,
                category: servicio.category,
                price: parseFloat(servicio.price),
                direction: servicio.direction,
                city_id: parseInt(servicio.city_id),
                all_day: servicio.all_day
            })
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: "Error interno del servidor" }));
            return { success: false, error: errorData.error };
        }

        const data = await res.json();
        return { success: true, data };
    } catch (err) {
        console.error("Error en fetch:", err);
        return { success: false, error: "Error de conexión con el servidor" };
    }
};

export const deleteService = async (servicio) => {     
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/service/${servicio.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: "Error interno del servidor" }));
            return { success: false, error: errorData.error };
        }
        
        return { success: true};

    } catch (err) {
        console.error("Error en fetch:", err);
        return { success: false, error: "Error de conexión con el servidor" };
    }
};