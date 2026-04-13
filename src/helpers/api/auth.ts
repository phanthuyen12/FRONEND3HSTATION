import { APICore } from "./apiCore";

const api = new APICore();

// account
function login(params: { username: string; password: string }) {
  // Mapping username to email as expected by backend
  const payload = {
    email: params.username,
    password: params.password
  };
  const baseUrl = "/api/auth/login";
  return api.create(`${baseUrl}`, payload);
}

function logout() {
  const baseUrl = "/api/auth/logout";
  return api.create(`${baseUrl}`, {});
}

function signup(params: { fullname: string; email: string; password: string }) {
  const baseUrl = "/api/auth/register";
  const payload = {
    name: params.fullname,
    email: params.email,
    password: params.password
  };
  return api.create(`${baseUrl}`, payload);
}

function forgotPassword(params: { username: string }) {
  const baseUrl = "/api/auth/forgot-password";
  return api.create(`${baseUrl}`, { email: params.username });
}

export { login, logout, signup, forgotPassword };
