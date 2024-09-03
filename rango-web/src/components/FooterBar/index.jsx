import { Link, useLocation } from 'react-router-dom';
import './FooterBar.css';
import { useEffect } from 'react';
const FooterBar = ({setOpenUserModal,openUserModal}) => {
    const location = useLocation();
    useEffect(() => {
        setOpenUserModal(false);
    },[location.pathname,setOpenUserModal]);
    return(
        <>
            <div className="footer-bar">
                <Link to="/home"><i className='fa fa-home'></i><p>Início</p></Link>
                <button><i className='fa fa-search'></i><p>Busca</p></button>
                <button><i className='fa fa-list'></i><p>Pedidos</p></button>
                <button style={{"color": openUserModal ? "var(--color-max)":"var(--color)"}} onClick={e=>setOpenUserModal(!openUserModal)}><i className='fa fa-user'></i><p>Perfil</p></button>
            </div>
        </>
    );
};

export default FooterBar;