import { Link, useNavigate } from "react-router-dom";
import { signInOutCustom } from "../../config/FirebaseConfig";
import { useEffect, useState } from "react";
import api from "../../config/ApiConfig";

const Home = () => {
    const navigator = useNavigate();
    const [id, setId] = useState(null);

    
    const handleSignOut = async () => {
        await signInOutCustom();
        return navigator("/");
    }
    return (
    <>
        <h1>Logado com sucesso</h1>
        <Link>Editar Usuário</Link>
        <button onClick={handleSignOut}>Sair</button>
    </>
    );
};

export default Home;