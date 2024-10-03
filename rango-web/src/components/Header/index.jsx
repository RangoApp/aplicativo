import { useEffect, useRef, useState } from 'react';
import './Header.css';
import MessageComponent from '../MessageComponent';

import { Link, useNavigate } from 'react-router-dom';
import FooterBar from '../FooterBar';
import AddressModal from '../AddressModal';
import { useUser } from '../UserProvider';
import { signInOutCustom } from '../../config/FirebaseConfig';
import SacolaModal from '../SacolaModal';

const Header = ({children}) => {
    const { user,getSelecionado } = useUser();
    const [message, setMessage] = useState(null);
    const [openAddressModal, setOpenAddressModal] = useState(false);
    const [sacola,setSacola]=useState({total:0,qtd:0});
    const [openUserModal,setOpenUserModal] = useState(false);
    const [openSacolaModal,setOpenSacolaModal]=useState(false);
    const navigator = useNavigate();
   
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        const sacola = localStorage.getItem("sacola");
        if(sacola) {
            const sacolaObj = JSON.parse(sacola); // Converter string JSON para objeto
            const total = sacolaObj.itens.reduce((acc, item) => acc + item.preco, 0); // Soma dos preços
            const qtd = sacolaObj.itens.reduce((acc, item) => acc + item.qtd, 0); // Soma das quantidades
            setSacola({total: total + sacolaObj.frete,qtd: qtd})
        }
    },[]);

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
            <Link className='logo' to={"/home"}><img src="/assets/img/rango-logo.png"/></Link>
            <nav>
                <button className="address-info" onClick={e=>setOpenAddressModal(true)}>
                    <span>{getSelecionado ? `${getSelecionado?.logradouro}, ${getSelecionado?.numero}` : "Sem endereço"}</span>
                    <i className='fa fa-angle-left'></i>
                </button>
                <div className='desktop-bar'>
                    <button onClick={e=>setOpenUserModal(true)} className='perfil-btn'><i className='fa fa-user'></i></button>
                    <button onClick={()=>setOpenSacolaModal(!openSacolaModal)} className={`sacola-header ${sacola.qtd > 0 && sacola.total > 0 ? "active" : ""}`}>
                        <i className='fa fa-cart-shopping'></i>
                        <div  id='info'>
                            <span id='valor'>R${sacola.total.toFixed(2)}</span>
                            <span id='qtd'>{sacola.qtd > 1 ? `${sacola.qtd} itens` : `${sacola.qtd} item`} </span>
                        </div>
                    </button>
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
                    <h3>{user?.nomeCompleto ? `Olá, ${user.nomeCompleto.split(' ')[0]}` : ""}</h3>
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

        <SacolaModal setOpenSacolaModal={setOpenSacolaModal} openSacolaModal={openSacolaModal}/>
        

        <div className='main-content'>
        {children}
        </div>
        <FooterBar setOpenUserModal={setOpenUserModal} openUserModal={openUserModal} openSacolaModal={openSacolaModal} setOpenSacolaModal={setOpenSacolaModal} />
        </>
    );
};

export default Header;