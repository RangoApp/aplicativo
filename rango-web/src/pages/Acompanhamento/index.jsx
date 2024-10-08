import { useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import { useUser } from '../../components/UserProvider';
import { useParams } from "react-router-dom";
import './Acompanhamento.css';
const Acompanhamento = () => {
    const {getSelecionado} = useUser();
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
              return 1; // Muda o status para 1 após 10 segundos
            }
            return prevStatus;
          });
        }, intervalFirstStatus);
      
        // Depois que o primeiro status mudou, muda o status de 1 para 2 e 2 para 3
        const intervalEntrega = setInterval(() => {
          setStatus(prevStatus => {
            if (prevStatus === 1) {
              return 2;
            } else if (prevStatus === 2) {
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
    },[]);

    if(order!=null)
    return(
        <>
        <div className="container-wrapper">
            <div className="container">
                <div className="aco-header">
                    <p>Previsão de entrega</p>
                    <span>{horario}</span>
                    <div className="status-bar">
                        <div style={{background: status > 0 ? "rgb(60, 226, 60)" : "#efefef"}} id="bar">{status == 0 &&<div></div>}</div>
                        <div style={{background: status > 1 ? "rgb(60, 226, 60)" : "#efefef"}} id="bar">{status == 1 &&<div></div>}</div>
                        <div style={{background: status > 2 ? "rgb(60, 226, 60)" : "#efefef"}} id="bar">{status == 2 &&<div></div>}</div>
                    </div>
                    <span id="status-text"><div></div>{status == 0 ? "Aguardando a confirmação do restaurante" : status == 1 ? "Preparando" : status == 2 ? "Á caminho" : "Pedido Finalizado"}</span>
                    <div className="endereco">
                        <span>Entrega em</span>
                        <p>{getSelecionado.logradouro}, {getSelecionado.numero}</p>
                        <p>{getSelecionado.bairro} - {getSelecionado.cidade}, {getSelecionado.estado}</p>
                    </div>
                    <div className="">

                    </div>
                </div>

            </div>
        </div>
        </>
    )
};

export default Acompanhamento;