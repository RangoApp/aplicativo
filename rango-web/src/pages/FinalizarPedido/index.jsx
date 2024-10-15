import './FinalizarPedido.css';
import { useUser } from '../../components/UserProvider';
import { useEffect, useState } from 'react';
import SacolaModal from '../../components/SacolaModal';
import { useNavigate } from 'react-router-dom';
import api from '../../config/ApiConfig';
import axios from 'axios';
import LoadingCustom from '../../components/LoadingCustom';

const FinalizarPedido=()=>{

    const {user}=useUser();
    const [openSacolaModal,setOpenSacolaModal ] = useState(true);
    const { getSelecionado } = useUser();
    const navigator = useNavigate();
    const [sacola,setSacola]=useState(null);
    const [cartoes,setCartoes]=useState([]);
    const [idCartao,setIdCartao]=useState(0);
    const [isLoading,setIsLoading]=useState(false);


    
    useEffect(()=>{
        const fetchSacola = async () => {
            const sacolaStorage = localStorage.getItem("sacola");
            if(sacolaStorage!= null) {
                const sacolaObj = JSON.parse(sacolaStorage);
                setSacola(sacolaObj);
            }
        };

        const fetchCartoes = async()=> {
            api.get("/cartoes/"+user.idUsuario).then((response)=>{
                setCartoes(response.data);
            }).catch((error)=>{

            })
        }
        
        fetchSacola();
        fetchCartoes();
    },[]);

    const handleFinalizar = async () => {
        setIsLoading(true);
        const clientId = "Afn7IwSiySCxJ3bApiIJTKW8cdPF9jXjz3ho1d6v5YtGsIep6KxrxKTWdWTQV9JjBF9m6U5IXpiVkiRF";
        const clientSecret = "EBTOmidqy17x_ZHylv61lsWMWRLAyh98dXjknbTDVeYsgFqheh77zWWoPU8zagujUL2YCqpLPYvu7Abi";
        const auth = btoa(`${clientId}:${clientSecret}`);

        const tokenResponse = await axios.post("https://api-m.sandbox.paypal.com/v1/oauth2/token", null, {
            headers: {
                "Authorization": `Basic ${auth}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            params: {
                grant_type: "client_credentials"
            }
        });

        const accessToken = tokenResponse.data.access_token;
        var subtotal = sacola.itens.reduce((total,item)=>{return item.preco + total},0)
        var total = subtotal + sacola.frete + (subtotal < 35 ? 0.99 : 0);
        var paypalBody = {
            "intent": "sale",
            "payer": {
              "payment_method": "paypal"
            },
            "transactions": [{
              "amount": {
                "total": parseFloat( total.toFixed(2) ),
                "currency": "BRL"
              },
              "description": "Compra"
            }],
            "redirect_urls": {
              "return_url": "https://example.com/success",
              "cancel_url": "https://example.com/cancel"
            }
          };          
        try {
        console.log(paypalBody)
        
        const paypal = await axios.post("https://api.sandbox.paypal.com/v1/payments/payment",paypalBody,
            {headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"}
        });

        const response = await api.post("/pedidos",sacola);
        navigator('/pedido/acompanhamento/'+response.data);
    } catch(e) {
        console.log(e)
    } finally {
        setIsLoading(false);
    }
    }
    return(
        <>
            <div className='container-wrapper'>
                {isLoading && <LoadingCustom />}
                {!isLoading&&<div className='container finalizar-pedido'>
                    <div className='col-1'>
                        <h1>Finalize seu pedido</h1>
                        <div className='entrega'>
                            <h4>Entrega</h4>
                            <label>{getSelecionado.logradouro}, {getSelecionado.numero}</label>
                            <p>{getSelecionado.cidade}/{getSelecionado.estado}</p>
                        </div>

                        <div className='pagamento'>
                            <h4>Pagamento</h4>
                            <h2>Adicione um cartão no Rango</h2>
                            <p>É prático, seguro e você não perde nenhum minuto a mais quando seu pedido chegar.</p>
                            {cartoes.map((cartao,key)=>{
                                return(
                                    <div onClick={()=>setIdCartao(cartao.idCartao)} className={`cartao ${idCartao == cartao.idCartao ? "active" : ""}`}>
                                        <p>{"***"+cartao.numero.toString().slice(-4)}</p>
                                        <p>{"Dt. Validade:" +String(new Date(cartao.dtVal).getMonth() + 1).padStart(2, '0')+"/"+String(new Date(cartao.dtVal).getFullYear()).slice(-2)}</p>
                                    </div>
                                )
                            })}
                            <button onClick={()=>navigator('/cartao')}>Adicionar novo cartão</button>
                        </div>

                        <button onClick={handleFinalizar} id='finalizar'>Fazer pedido</button>
                    </div>
                    <SacolaModal finalizarPedido={true} openSacolaModal={openSacolaModal} setOpenSacolaModal={setOpenSacolaModal}/>
                </div>}
            </div>
        </>
    )
};

export default FinalizarPedido;