import './LoadingCustom.css';
const LoadingCustom = ({color=false}) => {
    return(
        <> 
        {color ?
        <img id='loading-custom' src='/assets/svg/loading-color.svg' alt='Carregando'/>
        : <img id='loading-custom' src="/assets/svg/loading.svg" alt="Carregando" />}
        </>
    )
};

export default LoadingCustom;