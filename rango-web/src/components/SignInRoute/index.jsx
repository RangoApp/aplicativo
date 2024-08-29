import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const SignInRoute = ({ component: Component, restricted = false }) => {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && restricted) {
    console.log('chegou aqui')
    return <Navigate to="/home" />; // Redireciona para a página principal se o usuário estiver logado
  }

  return Component;
};

export default SignInRoute;
