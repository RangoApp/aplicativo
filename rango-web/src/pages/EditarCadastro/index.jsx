import { Link } from "react-router-dom";

const EditarCadastro = () => {
    return (<>

    <div>
    <h1>Meus Dados</h1>
    <div>
      <Link to="/minha-conta/informacao-pessoais">
        Informações Pessoais
      </Link>
    </div>
    <div>
      <Link to="/minha-conta/dados-contato">
        Dados de Contato
      </Link>
    </div>
    {/* <div>
      <Link to="">
        Credenciais
      </Link>
    </div> */}
  </div>
</>
    )
};

export default EditarCadastro;