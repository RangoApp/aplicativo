import React, { useEffect, useState } from 'react';
import { useUser } from '../../components/UserProvider';
import './DadosDeContato.css';
import { Link } from 'react-router-dom';

const DadosDeContato = () => {
  const {user}=useUser();
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  useEffect(()=>{
    if(user) {
      setEmail(user.email);
      setTelefone(user.telefone);
    }
  },[])
    return (<>
    <div className='editar-cadastro-wrapper'>
      <div className='editar-cadastro'>
      <h2>Dados de Acesso</h2>
      
      <div className='dados-contato'>
          <p>Estes dados são a sua forma de acesso ao Rango. Seu e-mail não pode ser alterado, porque é a informação principal de acesso à sua conta</p>
          <label>Email</label>
          <p>{email}</p>
          <label>Celular</label>
          <p>{telefone}</p>
          <div className='button-container'>
            <Link to="/minha-conta/dados-cadastrais" className="cancel-btn">Voltar</Link>
          </div>
      </div>
      </div>
    </div>
    </>
    )
  };

export default DadosDeContato;