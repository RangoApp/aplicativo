import './FooterBar.css';
const FooterBar = () => {
    return(
        <>
            <div className="footer-bar">
                <button><i className='fa fa-home'></i><p>Início</p></button>
                <button><i className='fa fa-search'></i><p>Busca</p></button>
                <button><i className='fa fa-list'></i><p>Pedidos</p></button>
                <button><i className='fa fa-person'></i><p>Perfil</p></button>
            </div>
        </>
    );
};

export default FooterBar;