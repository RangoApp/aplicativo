import { useEffect } from 'react';
import './ListaRestaurantes.css';
import { useState } from 'react';
import api from '../../config/ApiConfig';
import { useUser } from '../../components/UserProvider';
import { haversineDistance } from '../../includes/Utils';
const ListaRestaurantes = () => {

    const { user, fetchUser } = useUser();
    const [restaurantes,setRestaurantes]=useState([]);
    const [location,setLocation]=useState({latitude:null,longitude:null});
    useEffect(()=>{
        fetchUser();
        const enderecoSelecionado = user.enderecos.find(endereco => endereco.selecionado === true);
        setLocation({latitude:enderecoSelecionado.latitude,longitude:enderecoSelecionado.longitude});
    },[])
    useEffect(()=>{
        if(location.latitude && location.longitude) {
            api.get(`/restaurantes/proximos/${location.latitude}/${location.longitude}`).then((response)=>{
                setRestaurantes(response.data);
            });
        }
    },[location]);
    const categorias = [
        {
            img:"",
            link:"",
            descricao: "Lanches",
            id:"LANCHES"
        },
        {
            img:"",
            link:"",
            descricao:"Padaria",
            id:"PADARIA"
        },
        {
            img:"",
            link:"",
            descricao:"Brasileira",
            id:"BRASILEIRA"
        }
    ]

    return(
          <div className='lista-restaurantes'>
            <div className='lista-restaurantes-slider'>
                {
                    categorias.map(function (categoria,key) {
                        return(
                            <div key={key} className='lista-restaurantes-slider-card'>
                                <img src={categoria.img}/>
                                <label>{categoria.descricao}</label>
                            </div>
                        );
                    })
                }
            </div>
            <div className='lista-restaurantes-wrapper'>
                <div className='lista-restaurantes-header'>

                </div>
                <div className='lista-restaurantes-map'>
                    {
                        restaurantes.length>0&&restaurantes.map((restaurante,key)=>{
                            const distancia = haversineDistance(restaurante.endereco.latitude,restaurante.endereco.longitude,location.latitude,location.longitude).toFixed(1);
                            const tempo = (distancia * 60).toFixed(0);

                            const tempoLimite = (distancia * 180).toFixed(0);

                            const frete = distancia <= 0.2 ? 'Grátis' : 'R$'+(distancia * 3.99).toFixed(2);
                            return(
                                <div className='card'>
                                    <img src={restaurante.img} alt={"Logo do "+restaurante.nomeRes}/>
                                    <p id='title'>{restaurante.nomeRes}</p>
                                    <div className='subtitle'>
                                        <p>{restaurante.categoria}</p>
                                        <p>{distancia + "km"}</p>
                                    </div>
                                    <div className='frete'>
                                        <p>{`${tempo}-${tempoLimite} min . ${frete}`}</p>
                                    </div>

                                </div>
                            )
                        })
                    }
                </div>
            </div>
          </div>
    );
};

export default ListaRestaurantes;