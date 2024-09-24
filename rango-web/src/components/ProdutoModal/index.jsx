import { useState } from 'react';
import './ProdutoModal.css';
const ProdutoModal = ({setOpenProdutoModal,openProdutoModal,produto,restaurante}) => {
    const [qtd,setQtd]=useState(1);
    if(produto!=null)
    return(<>
    <div onClick={()=>setOpenProdutoModal(false)} className="background-shadow">
        <div onClick={(e)=>e.stopPropagation()} className="address-modal produto-modal">
            <button onClick={()=>setOpenProdutoModal(false)} className='back-btn'><i className='fa fa-angle-left'></i></button>
            <img src={produto.img}/>
            <div className='info-wrapper'>
            <div className='info'>
                <h2>{produto.nomeProduto}</h2>
                <p id='descricao'>{produto.descricao}</p>
                <h2 id='preco'>R${produto.preco.toFixed(2)}</h2>
                <div className='produto-wrapper'>
                    <h4>{restaurante.nomeRes}</h4>
                    <div id='divisor'></div>
                    <p id='info-res'>{restaurante.tempo.toFixed(0)}-{restaurante.tempoLimite.toFixed(0)} min • R${restaurante.precoMinimo.toFixed(2)}</p>
                </div>
                <p id='comentario'>Algum comentário?</p>
                <textarea placeholder="Ex: tirar a cebola, maionese à parte etc."></textarea>
                
            </div>
            <div className='add-cart'>
                    <div className='qtd-wrapper'>
                        <button style={{pointerEvents:qtd==1?"none":"auto",opacity:qtd==1?"0.6":"1"}} onClick={()=>setQtd(prevQtd => prevQtd-1)}>-</button>
                        <span>{qtd}</span>
                        <button onClick={()=>setQtd(prevQtd => prevQtd+1)}>+</button>
                    </div>
                    <button id='adicionar'><span>Adicionar</span><span>R${(produto.preco * qtd).toFixed(2)}</span></button>
                </div>
            </div>
        </div>
    </div>
    </>)
}
export default ProdutoModal;