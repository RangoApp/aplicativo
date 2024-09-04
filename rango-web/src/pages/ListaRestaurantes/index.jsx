import './ListaRestaurantes.css';
const ListaRestaurantes = () => {

    const categorias = [
        {
            img:"",
            link:"",
            descricao: "Promoções"
        },
        {
            img:"",
            link:"",
            descricao:"Pizza",
        }
    ]

    return(
          <div className='lista-restaurantes'>
            <div className='lista-restaurantes-slider'>
                {
                    categorias.map(function (categoria) {
                        return(
                            <div className='lista-restaurantes-slider-card'>
                                <img src={categoria.img}/>
                                <label>{categoria.descricao}</label>
                            </div>
                        );
                    })
                }
            </div>
          </div>
    );
};

export default ListaRestaurantes;