import React, { useState } from 'react';
import api from '../../config/ApiConfig';
import { useUser } from '../../components/UserProvider';
import { useNavigate } from 'react-router-dom';

const CartaoCadastro = () => {
    const {user}=useUser();
    const [numeroCartao, setNumeroCartao] = useState('');
    const [nome, setNome] = useState('');
    const [dtValidade, setDtValidade] = useState('');
    const [codigo, setCodigo] = useState('');
    const navigator = useNavigate();

            // Função para formatar o campo de validade em tempo real
            const handleDtValidadeChange = (e) => {
                let input = e.target.value;
        
                // Remove qualquer coisa que não seja número
                input = input.replace(/\D/g, '');
        
                // Limita o comprimento da string a 6 caracteres (MMYYYY)
                if (input.length > 6) {
                    input = input.slice(0, 6);
                }
        
                // Adiciona a barra (/) depois do mês
                if (input.length >= 3) {
                    input = input.slice(0, 2) + '/' + input.slice(2);
                }
        
                setDtValidade(input);
            };
        
            // Função para converter MM/YYYY para timestamp
            const converteParaTimestamp = (data) => {
                const [mes, ano] = data.split('/');
                
                const dataValidade = new Date(`01-${mes}-${ano}`); // Define o dia como 1º do mês
                return dataValidade.toISOString();
            };
    const handleCartao = async () => {
        var dtVal = converteParaTimestamp(dtValidade);
        var body = {
            idCartao:0,
            numero:parseInt(numeroCartao),
            nome:nome,
            dtVal: dtVal,
            cod:parseInt(codigo)}
        await api.post("/cartoes/"+user.idUsuario,body 
        );

        navigator("/pedido/finalizar")

    };
    return (
        <>
            <div className="container-wrapper">
                <div className="container">
                    <input
                        value={numeroCartao}
                        onChange={(e) => setNumeroCartao(e.target.value)}
                        placeholder="Número do Cartão"
                    />
                    <input
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Nome no Cartão"
                    />
                    <input
                        value={dtValidade}
                        onChange={handleDtValidadeChange}
                        placeholder="MM/YYYY"
                        maxLength="7" // Limita a entrada no formato MM/YYYY
                    />
                    <input
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        placeholder="Código de Segurança"
                    />
                    <button onClick={handleCartao}>Salvar</button>
                </div>
            </div>
        </>
    );
};

export default CartaoCadastro;
