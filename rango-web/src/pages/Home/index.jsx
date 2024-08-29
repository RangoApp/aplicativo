import { Link, useNavigate } from "react-router-dom";
import { signInOutCustom } from "../../config/FirebaseConfig";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import FooterBar from "../../components/FooterBar";

const Home = () => {
    const navigator = useNavigate();
    const [id, setId] = useState(null);
    useEffect(() => {
        const getIdRemember = async () => {
            setId(localStorage.getItem("idRemember"));
        };
        getIdRemember();
    },[]);

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