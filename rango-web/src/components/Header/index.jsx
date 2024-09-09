import { useEffect, useRef, useState } from 'react';
import './Header.css';
import MessageComponent from '../MessageComponent';

import { Link, useNavigate } from 'react-router-dom';
import FooterBar from '../FooterBar';
import AddressModal from '../AddressModal';
import { useUser } from '../UserProvider';
import { signInOutCustom } from '../../config/FirebaseConfig';

const Header = ({children}) => {
    const { user,getSelecionado } = useUser();
    const [message, setMessage] = useState(null);
    const [openAddressModal, setOpenAddressModal] = useState(false);

    const [openUserModal,setOpenUserModal] = useState(false);
    const navigator = useNavigate();
   
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        setOpenUserModal(false)
    },[openAddressModal])

    useEffect(()=>{
        setOpenAddressModal(false)
    },[openUserModal])

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => {
            setMessage(null);
        }, 3000); // A mensagem desaparece após 3 segundos
    };

    const handleSignOut = async () => {
        await signInOutCustom();
        return navigator("/");
    }
    
    return(
        <>
        {message && <MessageComponent type={message.type} text={message.text} />}
        <header>
            <Link to={"/home"}><img src="/assets/img/logo.png" alt="Logo do Rango"/></Link>
            <nav>
                <button className="address-info" onClick={e=>setOpenAddressModal(true)}>
                    <span>{getSelecionado ? `${getSelecionado.logradouro}, ${getSelecionado.numero}` : "Sem endereço"}</span>
                    <i className='fa fa-angle-left'></i>
                </button>
                <div className='desktop-bar'>
                    <button onClick={e=>setOpenUserModal(true)} className='perfil-btn'><i className='fa fa-user'></i></button>
                </div>
            </nav>
        </header>
        {openAddressModal && user != null &&
            <AddressModal setOpenAddressModal={setOpenAddressModal} openAddressModal={openAddressModal} />
        }

        {openUserModal && 
            <div onClick={()=>setOpenUserModal(false)} className='background-modal'>
                <div onClick={(e) => e.stopPropagation()}  className='user-modal'>
                    <button onClick={()=>setOpenUserModal(false)} className='back-btn'><i className='fa fa-angle-left'></i></button>
                    <h3>{user?.nomeCompleto ? `Olá, ${user.nomeCompleto}` : ""}</h3>
                    <nav>
                        <Link to="/minha-conta/dados-cadastrais">
                        <i className='fa fa-gear'></i>
                        <label>Meus Dados</label>
                        </Link>
                        <button onClick={handleSignOut}>
                        <i className='fa fa-arrow-right-to-bracket'></i>
                        <label>Sair</label>
                        </button>
                    </nav>
                </div>
            </div>
        }
        <div className='main-content'>
        {children}
        </div>
        <FooterBar setOpenUserModal={setOpenUserModal} openUserModal={openUserModal} />
        </>
    );
};

export default Header;