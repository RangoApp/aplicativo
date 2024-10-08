import { useEffect, useState } from 'react';
import api from '../../config/ApiConfig';
import './SacolaModal.css';
import { Link, useNavigate } from 'react-router-dom';
const SacolaModal = ({finalizarPedido,openSacolaModal,setOpenSacolaModal}) => {
    const [sacola,setSacola]=useState(null);
    const [subtotal,setSubtotal]=useState(0);
    const navigator = useNavigate();
    useEffect(() => {
        const fetchSacola = async () => {
            const sacolaStorage = localStorage.getItem("sacola");
            if(sacolaStorage!= null) {
                const sacolaObj = JSON.parse(sacolaStorage);
                setSubtotal(sacolaObj.itens.reduce((total,item)=>{return item.preco + total},0));
                setSacola(sacolaObj);
            }
        };
    
        fetchSacola();
    }, []);

    const handleRemove = (index) => {
        if (sacola) {
            // Faz uma cópia dos itens atuais da sacola para não modificar diretamente o estado
            const newSacola = { ...sacola, itens: [...sacola.itens] };
    
            // Remove o item pelo índice
            newSacola.itens.splice(index, 1);
    
            if (newSacola.itens.length === 0) {
                // Se a lista de itens ficar vazia, removemos a sacola do estado e do localStorage
                setSacola(null);
                setSubtotal(0);
                localStorage.removeItem("sacola");
            } else {
                // Atualiza o subtotal
                const newSubtotal = newSacola.itens.reduce((total, item) => item.preco + total, 0);
    
                // Atualiza o estado da sacola e o subtotal
                setSacola(newSacola);
                setSubtotal(newSubtotal);
    
                // Atualiza o localStorage
                localStorage.setItem("sacola", JSON.stringify(newSacola));
            }
            window.location.reload();
        }
    };

    if(sacola!=null)
    return(
        <>
        <div onClick={()=>{
            if(!finalizarPedido) 
            {
                setOpenSacolaModal(false)
            }
            }} className={`background-sacola-modal ${openSacolaModal ? 'open-background' : ''}`}>
            <div onClick={(e)=>e.stopPropagation()} className={`sacola-modal ${openSacolaModal ? 'open' : ''}`}>
                <div className='sacola-modal-container'>
                    {!finalizarPedido && <button onClick={()=>setOpenSacolaModal(false)} className='back-btn'><i className='fa fa-close'></i></button>}
                    <div className='sacola-modal-body'>
                        <div className='sacola-modal-header'>
                            <div className='title-wrapper'>
                                <p>Seu pedido em</p>
                                <h3>{sacola.nomeRes}</h3>
                            </div>
                            <Link to={"/restaurante/" + sacola.idRestaurante }>Ver cardápio</Link>
                        </div>
                        <div className='sacola-modal-itens'>
                            {sacola.itens.map((item,key) => {
                                return(
                                    <div key={key} className='card'>
                                        <div className='info'>
                                            <span>{`${item.qtd}x ${item.nomeProduto}`}</span>
                                            <span>{`R$${item.preco.toFixed(2)}`}</span>
                                        </div>
                                        <div className='options'>
                                            <button onClick={()=>navigator("/restaurante/" + sacola.idRestaurante)}>Editar</button>
                                            <button onClick={()=>handleRemove(key)}>Remover</button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className='financeiro-info'>
                            <div>
                                <label>Subtotal</label>
                                <p>R$ {subtotal.toFixed(2)}</p>
                            </div>
                            {subtotal < 35 &&<div>
                                <label>Taxa de Serviço</label>
                                <p>R$ 0.99</p>
                            </div>}
                            <div>
                                <label>Taxa de entrega</label>
                                <p>R$ {sacola.frete.toFixed(2)}</p>
                            </div>
                        </div>
                    
                    </div>
                    <div className={`sacola-modal-footer ${openSacolaModal ? 'open' : ''}`}>
                        <div>
                            <label>Total</label>
                            <p>R${(subtotal + sacola.frete + (subtotal < 35 ? 0.99 : 0)).toFixed(2) }</p>
                        </div>
                        {!finalizarPedido && <button onClick={()=>{
                            setOpenSacolaModal(false);
                            navigator('/pedido/finalizar')}}>Escolher forma de pagamento</button>}
                    </div>
                </div>
            </div>
        </div>
        </>
    )
};

export default SacolaModal;