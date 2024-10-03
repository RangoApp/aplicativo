import { useState } from 'react';
import './ProdutoModal.css';
const ProdutoModal = ({setOpenProdutoModal,openProdutoModal,produto,restaurante}) => {
    const [qtd,setQtd]=useState(1);
    const [obs,setObs]=useState('');
    

    const handleSave = () => {
        const precoBase = produto.preco * qtd;
        let sacola = localStorage.getItem("sacola");
    
        // Verifica se já existe uma sacola no localStorage
        if (sacola) {
            sacola = JSON.parse(sacola); // Converte a string JSON para objeto JavaScript
            // Verifica se a sacola pertence ao mesmo restaurante
            if (sacola.idRestaurante !== restaurante.idRestaurante) {
                // Lógica para lidar com mudança de restaurante, se necessário
                sacola = {
                    idRestaurante: restaurante.idRestaurante,
                    frete:restaurante.frete,
                    nomeRes:restaurante.nomeRes,
                    itens: []
                };
            }
        } else {
            // Cria uma nova sacola se não existir no localStorage
            sacola = {
                idRestaurante: restaurante.idRestaurante,
                frete:restaurante.frete,
                nomeRes:restaurante.nomeRes,
                itens: []
            };
        }

        const itemExistente = sacola.itens.find(item => item.idProduto === produto.idProduto);
        if (itemExistente) {
            // Se o item já existe, atualiza a quantidade e o preço
            itemExistente.preco += precoBase; // Ajusta o preço somando a quantidade
            itemExistente.qtd += qtd; // Atualiza a quantidade do produto
            itemExistente.obs = obs;
        } else {
            // Se o item não existe, cria um novo item
            const novoItem = {
                preco: precoBase,
                idProduto: produto.idProduto,
                nomeProduto:produto.nomeProduto,
                qtd: qtd, // Adiciona a quantidade atual,
                obs: obs
            };
            sacola.itens.push(novoItem);
        }
        // Salva a sacola atualizada de volta no localStorage
        localStorage.setItem("sacola", JSON.stringify(sacola));
        setOpenProdutoModal(false);
        window.location.reload();
    };


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
                <textarea value={obs} onChange={(e)=>setObs(e.target.value)} placeholder="Ex: tirar a cebola, maionese à parte etc."></textarea>
                
            </div>
            <div className='add-cart'>
                    <div className='qtd-wrapper'>
                        <button style={{pointerEvents:qtd==1?"none":"auto",opacity:qtd==1?"0.6":"1"}} onClick={()=>setQtd(prevQtd => prevQtd-1)}>-</button>
                        <span>{qtd}</span>
                        <button onClick={()=>setQtd(prevQtd => prevQtd+1)}>+</button>
                    </div>
                    <button onClick={handleSave} id='adicionar'><span>Adicionar</span><span>R${(produto.preco * qtd).toFixed(2)}</span></button>
                </div>
            </div>
        </div>
    </div>
    </>)
}
export default ProdutoModal;