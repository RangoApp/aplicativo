import { useEffect, useRef, useState } from 'react';
import './AddressModal.css';
import api, { apiGoogleKey } from '../../config/ApiConfig';
import axios from 'axios';
import MessageComponent from '../MessageComponent';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useUser } from '../UserProvider';
import LoadingCustom from '../LoadingCustom';
import GMaps from '../GMaps';
const AddressModal = ({setOpenAddressModal,openAddressModal}) => {

    const { noAddress,user,setNoAddress, fetchUser } = useUser();

    const {setIsAuthenticated } = useAuth();
    const [message, setMessage] = useState(null);
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [newLocation, setNewLocation] = useState({ latitude: null, longitude: null });
    const [permissionStatus, setPermissionStatus] = useState(null);
    const [currentAddress,setCurrentAddress] = useState('');

    const [street, setStreet] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [number,setNumber] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [complemento,setComplemento]=useState('');
    const [pontoRef,setPontoRef]=useState('');
    const inputRef = useRef(null);

    const [openOptions,setOpenOptions] = useState(null);
    const [openFormAddress,setOpenFormAddress] = useState(false);
    const [openSearch, setOpenSearch] = useState(false);
    const [openEditAddress, setOpenEditAddress] = useState(false);
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [searchAddresses,setSearchAddresses] = useState([]);
    const [query, setQuery] = useState('');
    const [editIdAddress,setEditIdAddress] = useState(null);

    const [tipo,setTipo] = useState(0);
    const [isLoaded,setIsLoaded] = useState(false);
    const [isLoading,setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (navigator.permissions) {
          navigator.permissions.query({ name: 'geolocation' }).then((result) => {
            setPermissionStatus(result.state);
    
            result.onchange = () => {
              setPermissionStatus(result.state);
            };
          });
        }
    }, []);

    useEffect(() => {
        handleGetLocation();
    },[permissionStatus]);

    useEffect(() => {
    if (location.latitude && location.longitude) {
        getAddressFromCoordinates(location.latitude, location.longitude);
    }
    }, [location]);

    useEffect(() => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
            }
        
            const timeout = setTimeout(() => {
            getAddressFromQuery(query);
            }, 800); // 3000 milissegundos = 3 segundos
        

            setDebounceTimeout(timeout);
            // Limpeza do timeout ao desmontar o componente
            return () => clearTimeout(timeout);
      }, [query]);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => {
            setMessage(null);
        }, 3000); // A mensagem desaparece após 3 segundos
    };
    const handleGetLocation = () => {
        if (permissionStatus === 'granted') {
            getCurrentLocation();
        } else if (permissionStatus === 'prompt') {
        navigator.geolocation.getCurrentPosition(
            (position) => {
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
            },
            (error) => handleError(error)
        );
        } else if (permissionStatus === 'denied') {
            showMessage("error","Por favor ative a localização para utilizar o aplicativo.");
        }
    };

    const getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
        (position) => {
            setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            });
        },
        (error) => handleError(error)
        );
    };

    const handleError = (error) => {
        switch (error.code) {
            case error.PERMISSION_DENIED:
            showMessage("error","User denied the request for Geolocation.");
            break;
            case error.POSITION_UNAVAILABLE:
            showMessage("error","Location information is unavailable.");
            break;
            case error.TIMEOUT:
            showMessage("error","The request to get user location timed out.");
            break;
            case error.UNKNOWN_ERROR:
            showMessage("error","An unknown error occurred.");
            break;
            default:
            showMessage("error","An unknown error occurred.");
            break;
        }
    };

    const getAddressFromCoordinates = async (latitude, longitude) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiGoogleKey}`
            );
            const data = await response.json();
            if (data.status === "OK") {
                const addressComponents = data.results[0].address_components;
                // Atualizando os estados com as partes do endereço

                var currentStreet = addressComponents.find(component => component.types.includes('route')).long_name;
                var currentNeigh = addressComponents.find(component => component.types.includes('sublocality') || component.types.includes('neighborhood') || component.types.includes('administrative_area_level_4') ).long_name;
                var currentCity = addressComponents.find(component => component.types.includes('administrative_area_level_2')).long_name;
                var currentState = addressComponents.find(component => component.types.includes('administrative_area_level_1')).short_name;
                var currentCountry = addressComponents.find(component => component.types.includes('country')).long_name;

                setCurrentAddress(`${currentStreet} - ${currentNeigh}, ${currentCity} - ${currentState}`)
            } 
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoaded(true);
        }
    };

    const getAddressFromQuery = async (query) => {
        setIsLoading(true);
        setSearchAddresses([]);
        try {
            if(query!=''){
                const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`,{
                    params:{
                        address:query,
                        key:apiGoogleKey,
                        components:"country:BR"
                    }
                });
                console.log(response.data)
                if (response.data.status === 'OK') {
                    
                   setSearchAddresses(response.data.results);
                } else {
                    showMessage("error","Unable to retrieve address.");
                }
            }
             
        } catch (error) {
            showMessage("error","Error fetching the address.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectedAddress = (idEndereco,logradouro,bairro,cidade,estado,latitude,longitude,numero,complemento,pontoRef,tipo) => {
        setStreet(logradouro);
        setNeighborhood(bairro);
        setCity(cidade);
        setState(estado);
        setNewLocation({latitude:latitude,longitude:longitude});
        setEditIdAddress(idEndereco ? idEndereco : null);
        setNumber(numero);
        setComplemento(complemento);
        setPontoRef(pontoRef);
        setTipo(tipo)
        setOpenEditAddress(true);
    }

    const handleVerifyAddress = () => {
        if(!noAddress) {
            setOpenAddressModal(false)
        }
    }

    const handleClick = () => {
        setQuery('');
        setSearchAddresses([]);
        setOpenSearch(prevState => {
          const newOpenSearch = !prevState;
          if (newOpenSearch && inputRef.current) {
            // Define o foco somente se o input estiver sendo exibido
            setTimeout(() => inputRef.current.focus(), 0);
          }
          return newOpenSearch;
        });
    };

    //Salvar novo endereço
    const handleSaveAddress = async () => {
        setIsLoading(true);
        const idUser = localStorage.getItem("idRemember");
        const body = {
            logradouro:street,
            numero:number,
            bairro:neighborhood,
            cidade:city,
            estado:state,
            complemento:complemento,
            pontoReferencia:pontoRef,
            idUsuario:idUser,
            casa: tipo == 1,
            trabalho: tipo == 2,
            latitude: newLocation.latitude,
            longitude: newLocation.longitude
        }
        try {
            if(editIdAddress) {
                const res = await api.put("/enderecos/" + editIdAddress,body);
            } else {
                const res = await api.post("/enderecos",body);
                if(noAddress) {
                    setIsAuthenticated(true);
                    localStorage.setItem("isAuthenticated",'true');
                    
                    setNoAddress(false);
                    navigate("/home");
                }
            }
            await fetchUser();
            setOpenAddressModal(false);
        } catch(e) {
            showMessage("error","Erro: não foi possível cadastrar este endereço");
        } finally {
            setIsLoading(false);
        
        }
    }

    const handleDeleteAddress = async (id) =>{
        setIsLoading(true);
        const idUser = localStorage.getItem("idRemember");
        try {
            const res = await api.delete("/enderecos/" + id)
            await fetchUser();
        } catch(e) {
            showMessage("error","Não é possível remover endereço principal");
        } finally {
            setIsLoading(false);
        }
    }

    const handleNewSelected = async(data) => {
        data.idUsuario = user.idUsuario;
        await api.put("/enderecos/" + data.idEndereco,data);
        window.location.reload();
    }

    return(
        <>
        {message && <MessageComponent type={message.type} text={message.text} />}
        
        <div onClick={handleVerifyAddress} className='background-shadow'>
                 <div onClick={e => e.stopPropagation()} className='address-modal'>
                 {isLoaded ? <>
                    {!openEditAddress &&
                    <div className='address-list'>
                        <div className='address-list-header'>
                            {!noAddress && <button onClick={handleVerifyAddress} className='close-modal'><i className='fa fa-angle-left'></i></button>}
                            <p className='title-address'>Onde você quer receber seu pedido?</p>
                            <div className='search-address-wrapper'>
                                <i onClick={handleClick} className={`fa ${openSearch ? 'fa-angle-left' : 'fa-search' }`}></i>
                                {!openSearch && <button onClick={handleClick}>Buscar endereço e número</button>}
                                <input style={{"display":openSearch?"flex":"none"}}  value={query} onChange={e=>setQuery(e.target.value)} ref={inputRef} placeholder='Buscar endereço e número' />
                            </div>

                            {!openSearch && currentAddress && <button onClick={e=>handleSelectedAddress(null,currentAddress.split(/[,-]/).map(part => part.trim())[0],currentAddress.split(/[,-]/).map(part => part.trim())[1],currentAddress.split(/[,-]/).map(part => part.trim())[2],currentAddress.split(/[,-]/).map(part => part.trim())[3],location.latitude,location.longitude,'','','',0 )} className='current-place'>
                                <i className="fa-solid fa-location-crosshairs"></i>
                                <div className='street-wrapper'>
                                    <p id="street">Usar localização atual</p>
                                    <p id='state'>{currentAddress}</p>
                                </div>
                            </button>}
                        </div>{
                            !openSearch && user.enderecos && 
                            <div className='search-addresses user-addresses'>
                                {
                                    user.enderecos.map((data,key) => {
                                        const isOpen = openOptions === key;
                                        return(
                                        <div key={key} className={`search-address-card ${data.selecionado ? 'search-address-card-selecionado' : ''}`}>
                                            {isOpen && <div className='address-options-actions'>
                                                <button onClick={()=>handleSelectedAddress(data.idEndereco, data.logradouro,data.bairro,data.cidade,data.estado,data.latitude,data.longitude,data.numero,data.complemento,data.pontoReferencia,data.casa?1:data.trabalho?2:0)}
                                                    ><i className='fa fa-edit'></i></button>
                                                <button onClick={()=>handleDeleteAddress(data.idEndereco)}><i className='fa fa-trash'></i></button>
                                            </div>}
                                            {!isOpen && <i className={`fa-solid ${data.casa ? "fa-house" : data.trabalho ? "fa-briefcase" : "fa-location-dot"}`}></i>}
                                            <div onClick={()=>{if(!data.selecionado) {handleNewSelected(data)}}} style={{"width":"80%"}} className='street-wrapper'>
                                                <p id='street'>{`${data.logradouro} ${data.numero ? ","+data.numero: ""}`}</p>
                                                <p id='state'>{`${data.bairro ? data.bairro + ", " : ""} ${data.cidade ? data.cidade + " - " : ""} ${data.estado ? data.estado : ""}`}</p>
                                                <p id='state'>{data.complemento}</p>
                                            </div>
                                            <button onClick={e=>setOpenOptions(isOpen ? null : key)} className='address-options'><i className="fa-solid fa-ellipsis-vertical"></i></button>
                                        </div>
                                        );
                                    })
                                }
                            </div>
                        }
                        
                        {openSearch && <>
                         
                        <div className='search-addresses'>
                        {isLoading ? <LoadingCustom color={true} /> :<>
                            {
                                searchAddresses.length > 0 && searchAddresses.map((data,key) => {
                                    console.log(data);
                                    var formatado = data.formatted_address;
                                    var addressComponents = data.address_components;
                                    var geometry = data.geometry.location;
                                    // Atualizando os estados com as partes do endereço
                                    var logradouro = addressComponents.find(component => component.types.includes('route'))?.long_name;
                                    var bairro = addressComponents.find(component => component.types.includes('sublocality') || component.types.includes('neighborhood') || component.types.includes('administrative_area_level_4') )?.long_name;
                                    var cidade = addressComponents.find(component => component.types.includes('administrative_area_level_2'))?.long_name;
                                    var estado = addressComponents.find(component => component.types.includes('administrative_area_level_1'))?.short_name;
                                    if(formatado && logradouro) {
                                        return(
                                            <button onClick={e=>handleSelectedAddress(null,logradouro,bairro,cidade,estado,geometry.lat,geometry.lng,'','','',0)} key={key} className='search-address-card'>
                                                <i className="fa-solid fa-location-dot"></i>
                                                <div className='street-wrapper'>
                                                    <p id='street'>{logradouro}</p>
                                                    <p id='state'>{`${bairro ? bairro + ", " : ""} ${cidade ? cidade + " - ": ""} ${estado ? estado : ""}, Brasil`}</p>
                                                </div>
                                            </button>
                                        );
                                    }
                                })
                            }
                            </>
                        }</div>
                        </>}
                        
                    </div>}
                    {openEditAddress &&
                    <div className='edit-address-wrapper'>
                        {!openFormAddress&&<div className='map-wrapper'>
                            <div className='map-header'>
                                <button onClick={e=>setOpenEditAddress(false)} className='back-btn'><i className='fa fa-angle-left'></i></button>
                            </div>
                            
                            <GMaps text={'Você está aqui?'} width={'100%'} height={'100%'} latitude={newLocation.latitude} longitude={newLocation.longitude}/>
                            <button className='btn-map-confirm' onClick={e=>setOpenFormAddress(true)}>Confirmar localização</button>
                        </div>}
                        {openFormAddress&&<div className='edit-address'>
                            <button onClick={e=>setOpenFormAddress(false)} className='back-btn'><i className='fa fa-angle-left'></i></button>
                            <div className='map'>
                                <GMaps text={''} width={'100%'} height={'100%'} latitude={newLocation.latitude} longitude={newLocation.longitude}/>
                            </div>

                            <div className='edit-address-form'>
                                <div className='address-complete'>
                                    <p className='address-street'>{`${street}${number != '' ? `, ${number}` : ""} `}</p>
                                    <p className='address-state'>{`${neighborhood ? neighborhood + ", " : ""} ${city ? city + " - " : ""} ${state ? state : ""}`}</p>
                                </div>
                                
                                <div className='input-group-1-4'>
                                    <div className='input-label-wrapper'>
                                        <input value={number} onChange={e=>setNumber(e.target.value)}/>
                                        <label>Número</label>
                                    </div>
                                    
                                    <div className='complemento-wrapper'>
                                        <div className='input-label-wrapper'>
                                            <input value={complemento} onChange={e=>setComplemento(e.target.value)} />
                                            <label>Complemento</label>
                                        </div>
                                        <p>Apartamento/Bloco/Casa</p>
                                    </div>
                                </div>
                                <div className='input-label-wrapper'>
                                    <input value={pontoRef} onChange={e=>setPontoRef(e.target.value)} />
                                    <label>Ponto de referência</label>
                                </div>
                                
                                <div className='address-type-wrapper'>
                                    <p>Favoritar como</p>
                                    <div className='address-type'>
                                        
                                        <button onClick={e=>{if(tipo == 1) { setTipo(0) } else {setTipo(1)}}} style={{"border": tipo == 1 ? "1px solid var(--primaryColor)" : "1px solid transparent"}} className='type'>Casa</button>
                                        <button onClick={e=>{if(tipo == 2) { setTipo(0) } else {setTipo(2)}}} style={{"border": tipo == 2 ? "1px solid var(--primaryColor)" : "1px solid transparent"}} className='type'>Trabalho</button>
                                    </div>
                                </div>
                            
                                <button style={{"opacity": !isLoading ? "1" : "0.6", "pointerEvents": !isLoading ? "visible":"none"}} onClick={handleSaveAddress} className='save-btn'>{isLoading ? <LoadingCustom /> :"Salvar endereço"}</button>
                            </div>
                        </div>}
                    </div>
                    }
                    </>
                    : <div style={{"height":"100%","display":"flex","justifyContent":"center","alignItems":"center"}}><LoadingCustom color={true}/></div>
                }
                
                </div>
            </div>
        </>
    )
}

export default AddressModal;