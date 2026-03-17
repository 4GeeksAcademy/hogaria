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

export const signup = async (user, navigate) => {
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