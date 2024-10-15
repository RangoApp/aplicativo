import { useParams } from 'react-router-dom';
import './Restaurante.css';
import { useEffect, useState } from 'react';
import api from '../../config/ApiConfig';
import ProdutoModal from '../../components/ProdutoModal';
import { haversineDistance } from '../../includes/Utils';
import { useUser } from '../../components/UserProvider';

const Restaurante = () => {

    const {id}=useParams();
    const { user, fetchUser } = useUser();
    const [restaurante,setRestaurante]=useState(null);
    const [openProdutoModal,setOpenProdutoModal]=useState(false);
    const [produtoSelected,setProdutoSelected]=useState(null);
    const [location,setLocation]=useState({latitude:null,longitude:null});

    useEffect(()=>{
        fetchUser();
        const enderecoSelecionado = user.enderecos.find(endereco => endereco.selecionado === true);
        setLocation({latitude:enderecoSelecionado.latitude,longitude:enderecoSelecionado.longitude});
    },[])

    useEffect(()=>{
        async function fetchRestaurante() {
            const response = await api.get("/restaurantes/" + id);
            var res = response.data;
            const distancia = haversineDistance(
                res.endereco.latitude,
                res.endereco.longitude,
                location.latitude,
                location.longitude
            );
            res.distancia = distancia;
            const tempo =  distancia < 3 ? 
            // (distancia * 20) + 20 
            3
            : distancia * 20; 
            res.tempo = tempo; 
            res.tempoLimite = tempo + 20; // Exemplo de limite de tempo
            res.frete = distancia * 3.99; // Exemplo de cálculo de frete

            setRestaurante(res);
        };

        fetchRestaurante();
        
    },[location]);

    if(restaurante!=null)
    return(
        <>
        <div className='container-wrapper'>
            <div className='container'>
                <img id='banner' src={restaurante.banner}/>
                <div className='restaurante-header'>
                    <div className='title'>
                        <img src={restaurante.img}/>
                        <h1>{restaurante.nomeRes}</h1>

                    </div>
                    <div className='info'>
                        <button>Ver mais</button>
                        <div id='divider'></div>
                        {restaurante.precoMinimo &&<div id='preco-minimo'>
                            <i className='fa fa-dollar'></i>
                             <span>Preço mínimo R${restaurante.precoMinimo.toFixed(2)}</span>
                        </div>}
                    </div>
                </div>
                <div className='restaurante-produtos'>
                    {
                        restaurante.produtos.map((produto,key)=>{
                            return(
                                <div onClick={()=>{
                                    setProdutoSelected(produto)
                                    setOpenProdutoModal(true)}} className='card'>
                                    <div className='info'>
                                        <p id='nomeProduto'>{produto.nomeProduto}</p>
                                        <p id='descricao'>{produto.descricao}</p>
                                        <p id='preco'>R${produto.preco.toFixed(2)}</p>
                                    </div>
                                    <img src={produto.img}/>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
        {openProdutoModal&&<ProdutoModal restaurante={restaurante} produto={produtoSelected} openProdutoModal={openProdutoModal} setOpenProdutoModal={setOpenProdutoModal}/>}
        </>
    )
};

export default Restaurante;