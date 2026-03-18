export const login = async (user, navigate) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`,{
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    alert(data.error);
    return;
  }
  localStorage.setItem("token", data.token);
  navigate("/");
};

export const signupUser = async (user, navigate) => {
  const response = await fetch (`${import.meta.env.VITE_BACKEND_URL}/api/register/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    alert(data.error)
  }else {
    alert(data.message)
    navigate('/login');
  }
}

export const signupCompany = async (company, navigate) => {
  const response = await fetch (`${import.meta.env.VITE_BACKEND_URL}/api/register/company`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(company)
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    alert(data.error)
  }else {
    alert(data.message)
    navigate('/login');
  }
}

/*export const privateCheck = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
        return false
    }
    const response = await fetch (`${import.meta.env.VITE_BACKEND_URL}/api`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    const data = await response.json()
    if (!response.ok) {
        localStorage.removeItem('token')
        return false
    }
    return true 
}*/