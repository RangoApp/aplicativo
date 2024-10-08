import './FinalizarPedido.css';
import { useUser } from '../../components/UserProvider';
import { useEffect, useState } from 'react';
import SacolaModal from '../../components/SacolaModal';
import { useNavigate } from 'react-router-dom';
import api from '../../config/ApiConfig';

const FinalizarPedido=()=>{

    const [openSacolaModal,setOpenSacolaModal ] = useState(true);
    const { getSelecionado } = useUser();
    const navigator = useNavigate();
    const [sacola,setSacola]=useState(null);
    
    useEffect(()=>{
        const fetchSacola = async () => {
            const sacolaStorage = localStorage.getItem("sacola");
            if(sacolaStorage!= null) {
                const sacolaObj = JSON.parse(sacolaStorage);
                setSacola(sacolaObj);
            }
        };
    
        fetchSacola();
    },[]);

    const handleFinalizar = async () => {
        const response = await api.post("/pedidos",sacola);
        navigator('/pedido/acompanhamento/'+response.data);
    }
    return(
        <>
            <div className='container-wrapper'>
                <div className='container finalizar-pedido'>
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
                            <button onClick={()=>navigator('/cartao')}>Adicionar novo cartão</button>
                        </div>

                        <button onClick={handleFinalizar} id='finalizar'>Fazer pedido</button>
                    </div>
                    <SacolaModal finalizarPedido={true} openSacolaModal={openSacolaModal} setOpenSacolaModal={setOpenSacolaModal}/>
                </div>
            </div>
        </>
    )
};

export default FinalizarPedido;