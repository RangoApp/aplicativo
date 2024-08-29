import { Link } from 'react-router-dom';
import './FooterBar.css';
const FooterBar = ({setOpenUserModal,openUserModal}) => {
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