import React, { useState } from 'react';


const DadosDeContato = () => {
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

    return (<>
    <div>
      <h1>MEUS DADOS</h1>
      <form>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Celular</label>
          <input
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
          />
        </div>
        <button type="submit">Salvar</button>
      </form>
    </div>
    </>
    )
  };

export default DadosDeContato;