import { useEffect, useRef } from 'react';
import './ListaRestaurantes.css';
import { useState } from 'react';
import api from '../../config/ApiConfig';
import { useUser } from '../../components/UserProvider';
import { haversineDistance } from '../../includes/Utils';
import { useNavigate } from 'react-router-dom';
import './ModalRestaurante.css';
import MessageComponent from '../../components/MessageComponent';
const ListaRestaurantes = () => {

    const sliderRef = useRef();
    const { fetchUser,getSelecionado } = useUser();
    const [restaurantes,setRestaurantes]=useState([]);
    const [location,setLocation]=useState({latitude:null,longitude:null});
    const [openOrdenar,setOpenOrdenar]=useState(false);
    const [openDistancia,setOpenDistancia]=useState(false);
    const [entregaGratis,setEntregaGratis]=useState(false);
    const [sortBy,setSortBy]=useState("idRestaurante");
    const [distancia,setDistancia]=useState(30);
    const [page,setPage]=useState(0);
    const [currentPage,setCurrentPage]=useState(null);
    const [loading, setLoading] = useState(false); 
    const [last,setLast] = useState(false);// Estado de carregamento
    const [message, setMessage] = useState(null);
    
    const navigator = useNavigate();

    useEffect(()=>{
        fetchUser();
        try {
            if(getSelecionado) {
                setLocation({latitude:getSelecionado.latitude,longitude:getSelecionado.longitude});
            } else {
                showMessage("error","Erro: Servidor desligado")
            }
        } catch(e) {
            console.log(e)
        }
    },[])

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => {
            setMessage(null);
        }, 3000); // A mensagem desaparece após 3 segundos
    };

    useEffect(() => {
        // Função para buscar restaurantes
        const fetchRestaurantes = async () => {
            if (location.latitude && location.longitude && currentPage != page) {
                setLoading(true); // Inicia o carregamento
                try {
                    const response = await api.get(`/restaurantes/proximos/${location.latitude}/${location.longitude}/${page}`);
                    
                    const result = response.data.content.map((restaurante) => {
                        const distancia = haversineDistance(
                            restaurante.endereco.latitude,
                            restaurante.endereco.longitude,
                            location.latitude,
                            location.longitude
                        );

                        const tempo = distancia < 3 ? (distancia * 20) + 20 : distancia * 20; // Exemplo de cálculo do tempo
                        const tempoLimite = tempo + 20; // Exemplo de limite de tempo
                        const frete = distancia * 3.99; // Exemplo de cálculo de frete

                        return {
                            ...restaurante,
                            distancia,
                            tempo,
                            tempoLimite,
                            frete,
                        };
                    });
                    setLast(response.data.last);
                    setCurrentPage(page);
                    setRestaurantes((prev) => [...prev, ...result]); // Adiciona novos restaurantes à lista
                } catch (error) {
                    console.error("Erro ao buscar restaurantes:", error);
                } finally {
                    setLoading(false); // Finaliza o carregamento
                }
            }
        };

        fetchRestaurantes(); // Chama a função para buscar restaurantes
    }, [location, page]);

    const categorias = [
        {
            img:"/assets/img/hamburguer5.jpg",
            link:"",
            descricao: "Lanches",
            id:"LANCHES"
        },
        {
            img:"/assets/img/brasil.jpg",
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
         {message && <MessageComponent type={message.type} text={message.text} />}
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
                <h3 id='title'>Lojas</h3>
                <div className='lista-restaurantes-map'>
                    {
                        restaurantes.length>0&&restaurantes.map((restaurante,key)=>{

                            if(((entregaGratis && restaurante.frete <= 2) || !entregaGratis)
                            && (restaurante.distancia <= distancia)
                            ) {
                            return(
                                <div key={key} onClick={()=>navigator("/restaurante/" + restaurante.idRestaurante)} className='card'>
                                    <img src={restaurante.img} alt={"Logo do "+restaurante.nomeRes}/>
                                    <div className='info'>
                                        <p id='title'>{restaurante.nomeRes}</p>
                                        <div className='subtitle'>
                                            <p>{restaurante.categoria.substring(0,1) + restaurante.categoria.substring(1).toLowerCase()}</p>
                                            <p>•</p>
                                            <p>{restaurante.distancia.toFixed(1) + "km"}</p>
                                        </div>
                                        <div className='frete'>
                                            <p>{`${restaurante.tempo.toFixed(0)}-${restaurante.tempoLimite.toFixed(0)} min •`}<span style={{marginLeft:"4px",color:restaurante.frete<=2?"var(--success)":"#747474"}}>{restaurante.frete <= 2 ? "Grátis" : "R$" + restaurante.frete.toFixed(2)}</span></p>
                                        </div>
                                        <div></div>
                                    </div>
                                </div>
                            )}
                        })
                    }
                </div>
                {!last && <button id='ver-mais' onClick={()=>setPage(prevPage => prevPage++)}>Ver mais</button>}
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
            <div onClick={e => e.stopPropagation()} className='address-modal filter-restaurante-modal filter-restaurante-modal-distancia'>
                <h3>Distância</h3>
                <p>menos de {distancia}km</p>
                <div className='filter-distancia'>

                    <span>0km</span>
                    <input className='range-slider' 
                    style={{
                        background: `linear-gradient(to right, var(--primaryColor) ${distancia}%, #d3d3d3 ${distancia}%)`
                    }} type="range" onChange={(e)=>setDistancia(e.target.value)} min="1" max="100" value={distancia} />
                    <span>100km</span>
                </div>
            </div>
        </div>}
        </>
    );
};

export default ListaRestaurantes;