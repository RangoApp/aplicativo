import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import FooterBar from "../FooterBar";

const ProtectedRoute = ({ component: Component }) => {
  const { user, isLoading } = useAuth();

  const Loading = () => <div className='loading-screen'>Loading...</div>;
  if (isLoading) {
    return <Loading />;
  }

  if (user != null) {
    return (
        <>
        {Component}
        <FooterBar />
        </>
    )
  } else {
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;