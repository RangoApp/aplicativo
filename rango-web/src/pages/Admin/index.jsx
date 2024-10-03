import React, { useState } from 'react';
import axios from 'axios';
import './Admin.css';
import api from '../../config/ApiConfig';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../config/FirebaseConfig';

const Admin = () => {
    const [etapa, setEtapa] = useState(1);

    // Estados para os dados do restaurante
    const [nomeRes, setNomeRes] = useState('');
    const [descrRes, setDescrRes] = useState('');
    const [precoMinimo, setPrecoMinimo] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [categoria, setCategoria] = useState('');

    // Estados para os dados do endereço
    const [idRestaurante, setIdRestaurante] = useState('');
    const [cep, setCep] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [numero, setNumero] = useState('');
    const [bairro, setBairro] = useState('');
    const [estado, setEstado] = useState('');
    const [cidade, setCidade] = useState('');
    const [longitude, setLongitude] = useState('');
    const [latitude, setLatitude] = useState('');

    // Estados para os dados do produto
    const [nomeProduto, setNomeProduto] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');

    const [imgRestaurante, setImgRestaurante] = useState(null);
    const [imgProduto, setImgProduto] = useState(null);
    const [imgBanner, setImgBanner] = useState(null);

    // Função para buscar dados do endereço pelo CEP
    const buscarEnderecoPorCep = async () => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            if (response.data) {
                setLogradouro(response.data.logradouro);
                setBairro(response.data.bairro);
                setEstado(response.data.uf);
                setCidade(response.data.localidade);
                // Você pode adicionar mais campos se necessário
            }
        } catch (error) {
            console.error("Erro ao buscar o endereço:", error);
            // Você pode mostrar uma mensagem de erro para o usuário se desejar
        }
    };

    const handleBuscaRes = async () => {
        try {
            const response = await api.get("/restaurantes/"+idRestaurante);
            setNomeRes(response.data.nomeRes);
            setDescrRes(response.data.descrRes);
            setPrecoMinimo(response.data.precoMinimo);
            setCategoria(response.data.categoria);
            setCnpj(response.data.cnpj);
            setImgBanner(response.data.banner);
            setImgRestaurante(response.data.imgRestaurante);
        } catch(e) {

        }
    }

    // Funções para salvar os dados (apenas exemplos, implemente conforme necessário)
    const handleRestaurante =  async() =>{
        if(idRestaurante == '') {
            const body = {
                nomeRes: nomeRes,
                descrRes: descrRes,
                precoMinimo: precoMinimo,
                img: imgRestaurante,
                cnpj:cnpj,
                banner:imgBanner,
                categoria:categoria
            };
            const result = await api.post("/restaurantes",body);
            setIdRestaurante(result.data);
        } else {
            const body = {
                nomeRes: nomeRes,
                descrRes: descrRes,
                precoMinimo: precoMinimo,
                img: imgRestaurante,
                cnpj:cnpj,
                banner:imgBanner,
                categoria:categoria
            };
            const result = await api.put("/restaurantes/" + idRestaurante,body);
        }
    setEtapa(2);
    };

    const handleEndereco = async() => {
        const body = {
            idEndereco:0,
            idRestaurante: idRestaurante,
            cep: cep,
            logradouro: logradouro,
            numero: numero,
            bairro: bairro,
            estado: estado,
            cidade: cidade,
            longitude: longitude,
            latitude: latitude,
        };
        await api.post("/enderecos/restaurantes",body);
        setEtapa(3);
    };

    const handleProduto = async() => {
        const body = {
            idRestaurante: idRestaurante,
            nomeProduto: nomeProduto,
            descricao: descricao,
            preco: preco,
            img:imgProduto
        };
        await api.post("/produtos",body);
    };

    const handleImageUpload = async (e, tipo) => {
        const file = e.target.files[0];
        const storageRef = ref(storage, `images/${file.name}`);
        
        try {
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            
            if (tipo === 'restaurante') {
                setImgRestaurante(url);
            } else if (tipo === 'produto') {
                setImgProduto(url);
            } else if (tipo === 'banner') {

                setImgBanner(url);
            }
        } catch (error) {
            console.error("Erro ao fazer upload da imagem:", error);
        }
    };

    return (
        <div className="admin">
            {etapa === 1 && (
                <div>
                    <input 
                        value={idRestaurante}
                        onChange={(e) => setIdRestaurante(e.target.value)}
                        placeholder="ID do Restaurante"
                    />
                    <button onClick={handleBuscaRes}>Buscar</button>
                    <input 
                        value={nomeRes}
                        onChange={(e) => setNomeRes(e.target.value)}
                        placeholder="Nome do Restaurante"
                    />
                    <input 
                        value={descrRes}
                        onChange={(e) => setDescrRes(e.target.value)}
                        placeholder="Descrição do Restaurante"
                    />
                    <input 
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value)}
                        placeholder="CNPJ"
                        maxLength={14}
                    />
                    <input 
                        value={precoMinimo}
                        onChange={(e) => setPrecoMinimo(e.target.value)}
                        placeholder="Preço Mínimo"
                    />
                    <input 
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        placeholder="Categoria"
                    />
                    <input type="file" accept="image/*" onChange={(e)=>handleImageUpload(e,'restaurante')} />
                    <input type="file" accept="image/*" onChange={(e)=>handleImageUpload(e,'banner')} />

                    <button onClick={handleRestaurante}>Salvar</button>
                    <button onClick={() => setEtapa(2)}>Avançar</button>
                </div>
            )}
            {etapa === 2 && (
                <div>
                    <input 
                        value={idRestaurante}
                        onChange={(e) => setIdRestaurante(e.target.value)}
                        placeholder="ID do Restaurante"
                    />
                    <input 
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                        placeholder="CEP"
                    />
                    <button onClick={buscarEnderecoPorCep}>Buscar Endereço</button>
                    <input 
                        value={logradouro}
                        onChange={(e) => setLogradouro(e.target.value)}
                        placeholder="Logradouro"
                    />
                    <input 
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                        placeholder="Número"
                    />
                    <input 
                        value={bairro}
                        onChange={(e) => setBairro(e.target.value)}
                        placeholder="Bairro"
                    />
                    <input 
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        placeholder="Estado"
                    />
                    <input 
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                        placeholder="Cidade"
                    />
                    <input 
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        placeholder="Latitude"
                    />
                    <input 
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        placeholder="Longitude"
                    />
                    <button onClick={handleEndereco}>Salvar</button>
                    <button onClick={() => setEtapa(3)}>Avançar</button>
                </div>
            )}
            {etapa === 3 && (
                <div>
                    <input 
                        value={idRestaurante}
                        onChange={(e) => setIdRestaurante(e.target.value)}
                        placeholder="ID do Restaurante"
                    />
                    <input 
                        value={nomeProduto}
                        onChange={(e) => setNomeProduto(e.target.value)}
                        placeholder="Nome do Produto"
                    />
                    <input 
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        placeholder="Descrição do Produto"
                    />
                    <input 
                        value={preco}
                        onChange={(e) => setPreco(e.target.value)}
                        placeholder="Preço"
                    />

                    <input type="file" accept="image/*" onChange={(e)=>handleImageUpload(e,'produto')} />
                    <button onClick={handleProduto}>Salvar</button>
                    <button onClick={() => { setEtapa(1);
                        setIdRestaurante('');
                    }}>Voltar</button>
                </div>
            )}
        </div>
    );
};

export default Admin;
