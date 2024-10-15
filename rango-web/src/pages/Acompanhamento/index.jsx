import { useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import { useUser } from '../../components/UserProvider';
import { useParams } from "react-router-dom";
import './Acompanhamento.css';
const Acompanhamento = () => {
    const {user,getSelecionado} = useUser();
    const {pedido}=useParams();
    const[order,setOrder] = useState(null);
    const[horario,setHorario] = useState('');
    const[dtNeg,setDtNeg] = useState(null);
    const[horarioEntrega,setHorarioEntrega] = useState(null);
    const [status, setStatus] = useState(0);

    useEffect(() => {

      if (!dtNeg || !horarioEntrega) {
        return; // Se dtNeg ou horarioEntrega não estiverem definidos, não faz nada
      }
      // Calcula a diferença total em milissegundos
      const diferencaEmMilissegundos = horarioEntrega.getTime() - dtNeg.getTime();

      // Divide o tempo em duas partes: 10 segundos para o primeiro status, o resto para os demais
      const intervalTimeTotal = diferencaEmMilissegundos;
      const intervalFirstStatus = 10000; // 10 segundos para o primeiro status
      const intervalOtherStatuses = (intervalTimeTotal - intervalFirstStatus) / 2; // O restante dividido igualmente
    
      // Muda o status de 0 para 1 após 10 segundos
      const interval = setInterval(() => {
        setStatus(prevStatus => {
          if (prevStatus === 0) {
              sendEmail(1);
            return 1; // Muda o status para 1 após 10 segundos
          }
          return prevStatus;
        });
      }, intervalFirstStatus);
    
      // Depois que o primeiro status mudou, muda o status de 1 para 2 e 2 para 3
      const intervalEntrega = setInterval(() => {
        
        setStatus(prevStatus => {
          if (prevStatus === 1) {
              sendEmail(2);
            return 2;
          } else if (prevStatus === 2) {
              sendEmail(3);
            clearInterval(intervalEntrega); // Para o intervalo quando o status atinge 3
            return 3;
          }
          return prevStatus;
        });
      }, intervalOtherStatuses);
    
      // Limpeza dos intervalos ao desmontar o componente
      return () => {
        clearInterval(interval);
        clearInterval(intervalEntrega);
      };
    }, [horarioEntrega, dtNeg]);
  

    useEffect(()=>{
       localStorage.removeItem("sacola");
        // const intervalPedido = setInterval(() => {
            api.get("/pedidos/"+pedido).then((response)=>{
                var dataTempo = new Date(response.data.tempo);
                var dataTempoLimite = new Date(response.data.tempoLimite);
    
                var horas = dataTempo.getHours().toString().padStart(2, '0');
                var minutos = dataTempo.getMinutes().toString().padStart(2, '0');
    
                var horasLimite = dataTempoLimite.getHours().toString().padStart(2, '0');
                var minutosLimite = dataTempoLimite.getMinutes().toString().padStart(2, '0');     
                setOrder(response.data);
                setHorario(`${horas}:${minutos} - ${horasLimite}:${minutosLimite}`);
                setDtNeg(new Date(response.data.dtNeg));
                setHorarioEntrega(dataTempo);
            });
          // }, 5000);

        //    // Limpeza dos intervalos ao desmontar o componente
        // return () => {
        //     clearInterval(intervalPedido);
        //   };
        
    },[]);

    const sendEmail = async (stts) => {
        api.post("/pedidos/email/" +pedido+"/"+ stts, {email:user.email})
    }

    if(order!=null)
    return(
        <>
        <div className="container-wrapper">
            <div className="container acompanhamento">
                {order.status==0 && <div className="aco-header">
                    <p>Previsão de entrega</p>
                    <span id="horario">{horario}</span>
                    <div className="status-bar">
                        <div style={{background: status > 0 ? "rgb(60, 226, 60)" : "#efefef"}} id="bar">{status == 0 &&<div></div>}</div>
                        <div style={{background: status > 1 ? "rgb(60, 226, 60)" : "#efefef"}} id="bar">{status == 1 &&<div></div>}</div>
                        <div style={{background: status > 2 ? "rgb(60, 226, 60)" : "#efefef"}} id="bar">{status == 2 &&<div></div>}</div>
                    </div>
                    <span id="status-text"><div></div>{status == 0 ? "Aguardando a confirmação do restaurante" : status == 1 ? "Preparando o pedido" : status == 2 ? "Entregador esta a caminho" : "Pedido Entregue"}</span>
                    <div className="endereco">
                        <span>Entrega em</span>
                        <p>{getSelecionado.logradouro}, {getSelecionado.numero}</p>
                        <p>{getSelecionado.bairro} - {getSelecionado.cidade}, {getSelecionado.estado}</p>
                    </div>
                    <div className="itens">
                      <span id="detalhes">Detalhes do pedido</span>
                      {
                        order.itens.map((item,key)=>{
                          return(
                            <div key={key} className="card">
                              <span>{item.qtd}x {item.produto.nomeProduto}</span>
                            </div>
                          )
                        })
                      }
                    </div>
                     <div className="codigo">
                        <span>Código: {order.codigo}</span>
                    </div>
                </div>}
                {order.status==3 && <div className="pedido-finalizado">
                <i className="fa fa-check"></i>
                <h1>Pedido finalizado</h1>
                <div className="endereco">
                        <span>Entrega em</span>
                        <p>{getSelecionado.logradouro}, {getSelecionado.numero}</p>
                        <p>{getSelecionado.bairro} - {getSelecionado.cidade}, {getSelecionado.estado}</p>
                    </div>
                <div className="itens">
                      <span id="detalhes">Detalhes do pedido</span>
                      {
                        order.itens.map((item,key)=>{
                          return(
                            <div key={key} className="card">
                              <span>{item.qtd}x {item.produto.nomeProduto}</span>
                            </div>
                          )
                        })
                      }
                    </div>
                
                </div>}

            </div>
        </div>
        </>
    )
};

export default Acompanhamento;