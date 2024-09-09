import React, { useEffect, useState } from 'react';
import './EditarInformacoesPessoais.css';
import { Link } from 'react-router-dom';
import api from '../../config/ApiConfig';
import MessageComponent from "../../components/MessageComponent";
import { useUser } from '../../components/UserProvider';
import LoadingCustom from '../../components/LoadingCustom';

function EditarInformacoesPessoais() {
    const { user } = useUser();
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [message, setMessage] = useState(null);
    const [isLoaded,setIsLoaded] = useState(false);
    const [isLoading,setIsLoading] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [cpfReadOnly,setCpfReadOnly] = useState(false);
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;


    useEffect(()=>{
      if(user) {
        setCpf(user.cpf ? formatCpf(user.cpf) : '');
        setCpfReadOnly(user.cpf ? true : false);
        setNome(user.nomeCompleto ? user.nomeCompleto : '');
      }

      setIsLoaded(true);
    },[])

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => {
            setMessage(null);
        }, 3000); // A mensagem desaparece após 3 segundos
    };

    const formatCpf = (value) => {
      // Remove tudo que não for número
      value = value.replace(/\D/g, '');
    
      // Coloca ponto entre o terceiro e o quarto dígito
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
    
      // Coloca ponto entre o sexto e o sétimo dígito
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
    
      // Coloca um traço entre o nono e o décimo dígito
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    
      return value;
    };

    const handleChangeCpf = (e) => {
      var value = e.target.value;
      value = formatCpf(value);
      setCpf(value);
      if (cpfRegex.test(value)) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    }
    
    async function handleSaveUser () {
      setIsLoading(true);
      
      const body = {
        nomeCompleto:nome,
        cpf:cpf.replace(/\D/g, '')
      }
      try {
        await api.put("/users/" + user.idUsuario,body);
        showMessage("success","Usuário atualizado com sucesso");
      } catch(e) {
      } finally {
        setIsLoading(false);
      }
    }

    return (
    <>
     {message && <MessageComponent type={message.type} text={message.text} />}
        <div className='editar-cadastro-wrapper'>
          <div className='editar-cadastro'>
          <h2>Editar informações pessoais</h2>
            <div className='editar-cadastro-form'>

              <div className='input-label-wrapper'>
                <input
                  type="text"
                  placeholder=''
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
                <label>Nome completo</label>
              </div>
              <div disabled={cpfReadOnly ? true : false} className={`input-label-wrapper`}>
                <input
                  type="text"
                  placeholder=''
                  value={cpf}
                  maxLength={14}
                  onChange={handleChangeCpf}
                />
                <label>CPF</label>
              </div>
              <p>Confirme se os números de seu CPF estão corretos antes de confirmar a edição</p>
              <div className='button-container'>
                <Link className='cancel-btn' to="/minha-conta/dados-cadastrais">{isLoading ? <LoadingCustom/> : "Voltar"}</Link>
                <button className='save-btn' onClick={handleSaveUser} type="submit">{isLoading ? <LoadingCustom/> : "Salvar"}</button>
              </div>
            </div>
            
          </div>
        </div>
    </>
    )
};

export default EditarInformacoesPessoais;