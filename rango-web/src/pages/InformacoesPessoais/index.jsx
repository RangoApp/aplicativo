import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function EditarInformacoesPessoais() {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    
    async function handleSaveUser () {
    }

    return (
    <>
        <div>
          <h1>Informações Pessoais</h1>
          <form onSubmit={handleSaveUser}>
            <div>
              <label>Nome:</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            <div>
              <label>CPF:</label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
              />
            </div>
            <button type="submit">Salvar</button>
          </form>
        </div>
    </>
    )
};

export default EditarInformacoesPessoais;