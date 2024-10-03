import { Link, useLocation } from 'react-router-dom';
import './FooterBar.css';
import { useEffect, useState } from 'react';
import SacolaModal from '../SacolaModal';
const FooterBar = ({setOpenUserModal,openUserModal,openSacolaModal,setOpenSacolaModal}) => {
    const location = useLocation();
    const [sacola,setSacola]=useState({total:0,qtd:0});
    useEffect(() => {
        setOpenUserModal(false);
    },[location.pathname,setOpenUserModal]);

    useEffect(()=>{
        const sacola = localStorage.getItem("sacola");
        if(sacola) {
            const sacolaObj = JSON.parse(sacola); // Converter string JSON para objeto
            const total = sacolaObj.itens.reduce((acc, item) => acc + item.preco, 0); // Soma dos preços
            const qtd = sacolaObj.itens.reduce((acc, item) => acc + item.qtd, 0); // Soma das quantidades
            setSacola({total: total + sacolaObj.frete,qtd: qtd})
        }
    },[]);
    return(
        <>
            <div style={{zIndex: openSacolaModal ? "0":"99999"}} className='footer-wrapper'>
                {sacola.qtd > 0 && sacola.total > 0 &&<button onClick={()=>setOpenSacolaModal(true)} className='sacola-footer'>
                    <div className='icon-cart'>
                        <i className='fa fa-cart-shopping'></i>
                        <span>{sacola.qtd}</span>
                    </div>
                    <label>Ver sacola</label>
                    <span id='valor'>R${sacola.total.toFixed(2)}</span>
                </button>}
                <div className="footer-bar">
                    <Link to="/home"><i className='fa fa-home'></i><p>Início</p></Link>
                    <button><i className='fa fa-search'></i><p>Busca</p></button>
                    <button><i className='fa fa-list'></i><p>Pedidos</p></button>
                    <button style={{"color": openUserModal ? "var(--color-max)":"var(--color)"}} onClick={e=>setOpenUserModal(!openUserModal)}><i className='fa fa-user'></i><p>Perfil</p></button>
                </div>
            </div>
            <SacolaModal setOpenSacolaModal={setOpenSacolaModal} openSacolaModal={openSacolaModal}/>
        </>
    );
};

export default FooterBar;