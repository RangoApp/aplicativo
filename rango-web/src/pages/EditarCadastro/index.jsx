import { Link } from "react-router-dom";
import './EditarCadastro.css';
const EditarCadastro = () => {
    return (<>

<div className="editar-cadastro-wrapper">
    <div className="editar-cadastro">
      <h2>Meus Dados</h2>
      <nav>
        <Link to="/minha-conta/informacao-pessoais">
          <p>Informações Pessoais</p>
          <p>Nome completo e CPF</p>
          <i className="fa fa-angle-right"></i>
        </Link>
        <Link to="/minha-conta/dados-contato">
          <p>Informações de acesso</p>
          <p>Meios de acesso a minha conta</p>
          <i className="fa fa-angle-right"></i>
        </Link>
      </nav>
    {/* <div>
      <Link to="">
        Credenciais
      </Link>
    </div> */}
  </div>
  </div>
</>
    )
};

export default EditarCadastro;