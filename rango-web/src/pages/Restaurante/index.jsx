import { useParams } from 'react-router-dom';
import './Restaurante.css';
import { useEffect, useState } from 'react';
import api from '../../config/ApiConfig';

const Restaurante = () => {

    const {id}=useParams();
    const [restaurante,setRestaurante]=useState(null);

    useEffect(()=>{
        async function fetchRestaurante() {
            const response = await api.get("/restaurantes/" + id);
            setRestaurante(response.data);
        };

        fetchRestaurante();
        
    },[]);

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
                                <div className='card'>
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
        </>
    )
};

export default Restaurante;