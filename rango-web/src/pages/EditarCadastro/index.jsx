const EditarCadastro = () => {
    return (<>

    <div>
    <h1>Meus Dados</h1>
    <div>
      <button onClick={() => alert('Informações Pessoais')}>
        Informações Pessoais
      </button>
    </div>
    <div>
      <button onClick={() => alert('Dados de Contato')}>
        Dados de Contato
      </button>
    </div>
    <div>
      <button onClick={() => alert('Credenciais')}>
        Credenciais
      </button>
    </div>
  </div>
</>
    )
};

export default EditarCadastro;