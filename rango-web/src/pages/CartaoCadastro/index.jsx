const CartaoCadastro = () => {
    return(
        <>
        <div className="container-wrapper">
            <div className="container">
                <input value={numeroCartao}/>
                <input value={nome}/>
                <input value={dtValidade}/>
                <input value={codigo}/>
            </div>
        </div>
        </>
    )
};

export default CartaoCadastro;