import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useEffect } from 'react';

const SignInRoute = ({ component: Component, restricted = false }) => {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && restricted) {
    return <Navigate to="/home" />; // Redireciona para a página principal se o usuário estiver logado
  }

  const resetStorage = async () => {
    localStorage.removeItem("idToken");
    localStorage.removeItem("idRemember");
    localStorage.removeItem("isAuthenticated");
  };

  return Component;
};

export default SignInRoute;
