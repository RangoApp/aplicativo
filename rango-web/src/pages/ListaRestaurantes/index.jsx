import { useEffect, useRef } from 'react';
import './ListaRestaurantes.css';
import { useState } from 'react';
import api from '../../config/ApiConfig';
import { useUser } from '../../components/UserProvider';
import { haversineDistance } from '../../includes/Utils';
import { useNavigate } from 'react-router-dom';
import './ModalRestaurante.css';
const ListaRestaurantes = () => {

    const sliderRef = useRef();
    const { user, fetchUser } = useUser();
    const [restaurantes,setRestaurantes]=useState([]);
    const [location,setLocation]=useState({latitude:null,longitude:null});
    const [openOrdenar,setOpenOrdenar]=useState(false);
    const [openDistancia,setOpenDistancia]=useState(false);
    const [entregaGratis,setEntregaGratis]=useState(false);
    const [sortBy,setSortBy]=useState("idRestaurante");
    const [distancia,setDistancia]=useState(30);
    
    const navigator = useNavigate();

    useEffect(()=>{
        fetchUser();
        const enderecoSelecionado = user.enderecos.find(endereco => endereco.selecionado === true);
        setLocation({latitude:enderecoSelecionado.latitude,longitude:enderecoSelecionado.longitude});
    },[])
    useEffect(()=>{
        if(location.latitude && location.longitude) {
            api.get(`/restaurantes/proximos/${location.latitude}/${location.longitude}`).then((response)=>{

                const result = response.data.map((restaurante) => {
                    const distancia = haversineDistance(
                        restaurante.endereco.latitude,
                        restaurante.endereco.longitude,
                        location.latitude,
                        location.longitude
                    );
    
                    // Calcular o tempo e o frete baseado na distância
                    const tempo = distancia * 60; // Exemplo de cálculo do tempo
                    const tempoLimite = distancia * 180; // Exemplo de limite de tempo
                    const frete = distancia * 3.99; // Exemplo de cálculo de frete
    
                    // Retorna o restaurante com as novas informações
                    return {
                        ...restaurante,
                        distancia,
                        tempo: tempo,
                        tempoLimite: tempoLimite,
                        frete: frete
                    };
                });
                setRestaurantes(result);
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

    const handlePrevious = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollLeft -= sliderRef.current.offsetWidth; // Move o slider para a esquerda
        }
    };

    const handleNext = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollLeft += sliderRef.current.offsetWidth; // Move o slider para a direita
        }
    };

    useEffect(() => {
        if (restaurantes.length > 0) {
            const sortedRestaurants = [...restaurantes].sort((a, b) => {
                if (a[sortBy] < b[sortBy]) return -1;
                if (a[sortBy] > b[sortBy]) return 1;
                return 0;
            });
            setRestaurantes(sortedRestaurants);
        }
    }, [sortBy]);
    return(
        <>
        <div className='container-wrapper'>
          <div className='container'>
            <div className='lista-restaurantes-slider-wrapper'>
                <div className='lista-restaurantes-slider' ref={sliderRef}>
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
                <div className='slider-controls'>
                    <button onClick={handlePrevious}><i className='fa fa-angle-left'></i></button>
                    <button onClick={handleNext}><i className='fa fa-angle-right'></i></button>
                </div>
            </div>
            <div className='lista-restaurantes-wrapper'>
                <div className='lista-restaurantes-header'>
                    <button onClick={()=>setOpenOrdenar(true)}>Ordenar<i className='fa fa-angle-down'></i></button>
                    <button className={entregaGratis? "active":""} onClick={()=>setEntregaGratis(!entregaGratis)}>Entrega Grátis</button>
                    <button onClick={()=>setOpenDistancia(true)}>Distância<i className='fa fa-angle-down'></i></button>
                </div>
                <h3>Lojas</h3>
                <div className='lista-restaurantes-map'>
                    {
                        restaurantes.length>0&&restaurantes.map((restaurante,key)=>{

                            if(((entregaGratis && restaurante.frete <= 2) || !entregaGratis)
                            && (restaurante.distancia <= distancia)
                            ) {
                            return(
                                <div onClick={()=>navigator("/restaurante/" + restaurante.idRestaurante)} className='card'>
                                    <img src={restaurante.img} alt={"Logo do "+restaurante.nomeRes}/>
                                    <div className='info'>
                                        <p id='title'>{restaurante.nomeRes}</p>
                                        <div className='subtitle'>
                                            <p>{restaurante.categoria}</p>
                                            <p>{restaurante.distancia.toFixed(1) + "km"}</p>
                                        </div>
                                        <div className='frete'>
                                            <p>{`${restaurante.tempo.toFixed(0)}-${restaurante.tempoLimite.toFixed(0)} min . ${restaurante.frete <= 2 ? "Grátis" : "R$" + restaurante.frete.toFixed(2)}`}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        })
                    }
                </div>
            </div>
          </div>
        </div>

        {openOrdenar&&<div onClick={()=>setOpenOrdenar(false)} className='background-shadow'>
            <div onClick={e => e.stopPropagation()} className='address-modal filter-restaurante-modal'>
                <h3>Ordenar por</h3>
                <div className='filter-ordenar'>
                    <button onClick={()=>setSortBy('idRestaurante')}>
                        <i></i>
                        <p>Ordenação Padrão</p>
                    </button>
                    <button onClick={()=>setSortBy('tempo')}>
                        <i></i>
                        <p>Tempo de Entrega</p>
                    </button >
                    <button onClick={()=>setSortBy('distancia')}>
                        <i></i>
                        <p>Menor distância</p>
                    </button>
                </div>
            </div>
        </div>}
        {openDistancia&&<div onClick={()=>setOpenDistancia(false)} className='background-shadow '>
            <div onClick={e => e.stopPropagation()} className='address-modal filter-restaurante-modal'>
                <h3>Distância</h3>
                <p>menos de {distancia}km</p>
                <div className='filter-distancia'>

                
                <input className='range-slider' 
                style={{
                    background: `linear-gradient(to right, var(--primaryColor) ${distancia}%, #d3d3d3 ${distancia}%)`
                }} type="range" onChange={(e)=>setDistancia(e.target.value)} min="1" max="100" value={distancia} />
                </div>
            </div>
        </div>}
        </>
    );
};

export default ListaRestaurantes;