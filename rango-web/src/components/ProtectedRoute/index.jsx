import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Header from "../Header";
import Acompanhamento from "../../pages/Acompanhamento";

const ProtectedRoute = ({ component: Component }) => {
  const { isLoading, isAuthenticated } = useAuth();

  const Loading = () => <div className='loading-screen'><img src={"/assets/img/rango-logo.png"}/></div>;
  if (isLoading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    return (
        <>
        <Header>
        {Component}
        </Header>

        </>
    )
  } else {
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;