export const setToken = (token: string) => {
  localStorage.setItem("access_token", token);
};

export const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
};