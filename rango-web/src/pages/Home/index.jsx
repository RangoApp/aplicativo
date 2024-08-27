import { useNavigate } from "react-router-dom";
import { signInOutCustom } from "../../config/FirebaseConfig";

const Home = () => {
    const navigator = useNavigate();
    const handleSignOut = async () => {
        await signInOutCustom();
        return navigator("/");
    }
    return (
    <>
        <h1>Logado com sucesso</h1>
        <button>Editar Usuário</button>
        <button onClick={handleSignOut}>Sair</button>
    </>
    );
};

export default Home;