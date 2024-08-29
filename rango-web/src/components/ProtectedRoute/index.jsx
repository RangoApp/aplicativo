import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import FooterBar from "../FooterBar";
import Header from "../Header";

const ProtectedRoute = ({ component: Component }) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  const Loading = () => <div className='loading-screen'>Loading...</div>;
  if (isLoading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    return (
        <>
        <Header />
        {Component}

        </>
    )
  } else {
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;