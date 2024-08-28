import { useEffect, useRef, useState } from 'react';
import './Header.css';
import MessageComponent from '../MessageComponent';
import { apiGoogleKey } from '../../config/ApiConfig';
import axios from 'axios';

const Header = () => {
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [openAddressModal, setOpenAddressModal] = useState(false);
    const [message, setMessage] = useState(null);
    const [permissionStatus, setPermissionStatus] = useState(null);

    //Endereços ligados ao usuário
    const [userAddress,setUserAddress] = useState('');
    const [userAddressList,setAddressList] = useState([{rua:'rua nicola',numero: '22',bairro:'bairrasso',cidade:'cidadao',estado:'sp',complemento:''},{rua:'rua nicola',numero: '22',bairro:'bairrasso',cidade:'cidadao',estado:'sp',complemento:'asdasdasdasdasdads'}]);

    const [currentAddress,setCurrentAddress] = useState('');

    const [street, setStreet] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [number,setNumber] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [complemento,setComplemento]=useState('');
    const [pontoRef,setPontoRef]=useState('');

    const [openSearch, setOpenSearch] = useState(false);
    const [openEditAddress, setOpenEditAddress] = useState(false);
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [searchAddresses,setSearchAddresses] = useState([]);
    const [query, setQuery] = useState('');

    const inputRef = useRef(null);

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
    if (location.latitude && location.longitude && street == '') {
        getAddressFromCoordinates(location.latitude, location.longitude);
    }
    }, [location]);

    useEffect(() => {
        if(query != '') {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
              }
          
              const timeout = setTimeout(() => {
                getAddressFromQuery(query);
              }, 3000); // 3000 milissegundos = 3 segundos
          
              setDebounceTimeout(timeout);
          
              // Limpeza do timeout ao desmontar o componente
              return () => clearTimeout(timeout);
        }
      }, [query]);
    
    
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
        showMessage("error","Location access has been denied. Please enable it in your browser settings.");
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
            } else {
                showMessage("error","Unable to retrieve address.");
            }
        } catch (error) {
            showMessage("error","Error fetching the address.");
        }
    };

    const getAddressFromQuery = async (query) => {
        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`,{
                params:{
                    address:query,
                    key:apiGoogleKey,
                    components:"country:BR"
                }
            });
            console.log(response)
            if (response.data.status === 'OK') {
               setSearchAddresses(response.data.results);
            } else {
                showMessage("error","Unable to retrieve address.");
            }
        } catch (error) {
            showMessage("error","Error fetching the address.");
        }
    };
    

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => {
            setMessage(null);
        }, 3000); // A mensagem desaparece após 3 segundos
    };

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
    
    const handleSelectedAddress = (rua,bairro,cidade,estado) => {
        setStreet(rua);
        setNeighborhood(bairro);
        setCity(cidade);
        setState(estado);
        setOpenEditAddress(true)
    }

    return(
        <>
        {message && <MessageComponent type={message.type} text={message.text} />}
        <header>
            <img />
            <button className="address-info" onClick={e=>{
                handleGetLocation();
                setOpenAddressModal(true)}}>
                <span>{userAddress ? userAddress : "Sem endereço"}</span>
                <i className='fa fa-angle-left'></i>
            </button>
        </header>
        {openAddressModal &&
            <div onClick={e=>setOpenAddressModal(false)} className='background-shadow'>
                 <div onClick={e => e.stopPropagation()} className='address-modal'>
                    {!openEditAddress &&
                    <div className='address-list'>
                        <div className='address-list-header'>
                            <button onClick={e=>setOpenAddressModal(false)} className='close-modal'><i className='fa fa-angle-left'></i></button>
                            <p className='title-address'>Onde você quer receber seu pedido?</p>
                            <div className='search-address-wrapper'>
                                <i onClick={handleClick} className={`fa ${openSearch ? 'fa-angle-left' : 'fa-search' }`}></i>
                                {!openSearch && <button onClick={handleClick}>Buscar endereço e número</button>}
                                <input style={{"display":openSearch?"flex":"none"}}  value={query} onChange={e=>setQuery(e.target.value)} ref={inputRef} placeholder='Buscar endereço e número' />
                            </div>
                            {!openSearch && <button onClick={e=>handleSelectedAddress(currentAddress.split(/[,-]/).map(part => part.trim())[0],currentAddress.split(/[,-]/).map(part => part.trim())[1],currentAddress.split(/[,-]/).map(part => part.trim())[2],currentAddress.split(/[,-]/).map(part => part.trim())[3] )} className='current-place'>
                                <i className="fa-solid fa-location-crosshairs"></i>
                                <div className='street-wrapper'>
                                    <p id="street">Usar localização atual</p>
                                    <p id='state'>{currentAddress}</p>
                                </div>
                            </button>}
                        </div>
                        
                            {
                                !openSearch && userAddressList.length > 0 && 
                                <div className='search-addresses user-addresses'>
                                    {
                                        userAddressList.map((data,key) => {
                                            return(
                                            <div key={key} className='search-address-card'>
                                                <div className='address-options-actions'>
                                                    <button><i className='fa fa-edit'></i></button>
                                                    <button><i className='fa fa-trash'></i></button>
                                                </div>
                                                <i className="fa-solid fa-location-dot"></i>
                                                <div className='street-wrapper'>
                                                    <p id='street'>{`${data.rua}, ${data.numero}`}</p>
                                                    <p id='state'>{`${data.bairro}, ${data.cidade} - ${data.estado}`}</p>
                                                    <p id='state'>{data.complemento}</p>
                                                </div>
                                                <button className='address-options'><i className="fa-solid fa-ellipsis-vertical"></i></button>
                                            </div>
                                            );
                                        })
                                    }
                                </div>
                            }
                        {openSearch && <div className='search-addresses'>
                            {
                                searchAddresses.length > 0 && searchAddresses.map((data,key) => {
                                    var addressComponents = data.address_components;
                                    // Atualizando os estados com as partes do endereço
                                    var rua = addressComponents.find(component => component.types.includes('route'))?.long_name;
                                    var bairro = addressComponents.find(component => component.types.includes('sublocality') || component.types.includes('neighborhood') || component.types.includes('administrative_area_level_4') )?.long_name;
                                    var cidade = addressComponents.find(component => component.types.includes('administrative_area_level_2'))?.long_name;
                                    var estado = addressComponents.find(component => component.types.includes('administrative_area_level_1'))?.short_name;
                                    if(rua!=undefined&&bairro!=undefined&&cidade!=undefined&&estado!=undefined) {
                                        return(
                                            <button onClick={e=>handleSelectedAddress(rua,bairro,cidade,estado)} key={key} className='search-address-card'>
                                                <i className="fa-solid fa-location-dot"></i>
                                                <div className='street-wrapper'>
                                                    <p id='street'>{rua}</p>
                                                    <p id='state'>{`${bairro}, ${cidade} - ${estado}, Brasil`}</p>
                                                </div>
                                            </button>
                                        );
                                    }
                                })
                            }
                        </div>}
                    </div>}
                    {openEditAddress &&
                    <div className='edit-address'>
                        <button onClick={e=>setOpenEditAddress(false)} id='back-btn-modal' className='fa fa-angle-left'></button>
                        <div className='map'></div>

                        <div className='edit-address-form'>
                            <div className='address-complete'>
                                <p className='address-street'>{`${street}${number != '' ? `, ${number}` : ""} `}</p>
                                <p className='address-state'>{`${neighborhood}, ${city} - ${state}`}</p>
                            </div>
                            
                            <div className='input-group-1-4'>
                                <input id="number-input" value={number} onChange={e=>setNumber(e.target.value)}/>
                                <div className='complemento-wrapper'>
                                    <input id="complemento-input" />
                                    <p>Apartamento/Bloco/Casa</p>
                                </div>
                            </div>
                            <input />
                            <div className='address-type-wrapper'>
                                <p>Favoritar como</p>
                                <div className='address-type'>
                                    
                                    <button className='type'>Casa</button>
                                    <button className='type'>Trabalho</button>
                                </div>
                            </div>
                           
                            <button className='save-btn'>Salvar endereço</button>
                        </div>
                    </div>
                    }
                </div>
            </div>
        }
        </>
    );
};

export default Header;