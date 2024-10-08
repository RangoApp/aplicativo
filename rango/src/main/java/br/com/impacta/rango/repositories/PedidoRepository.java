package br.com.impacta.rango.repositories;

import java.sql.Timestamp;
import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.impacta.rango.entities.ItemPedido;
import br.com.impacta.rango.entities.Pedido;
import br.com.impacta.rango.entities.Produto;
import br.com.impacta.rango.interfaces.IPedidoRepository;

@Service
public class PedidoRepository {
	@Autowired
	private IPedidoRepository repo;
	
	public Long savePedido(Pedido pedido) {
		try {
		 for (ItemPedido item : pedido.getItens()) {
		        item.setPedido(pedido);  // Associa o pedido a cada item
		    }
			pedido.setDtNeg(Timestamp.from(Instant.now()));
			pedido.setStatus(1);
			pedido.setCodigo(randomCodigo());
			Pedido newPedido = repo.save(pedido);
			return newPedido.getIdPedido();
		} catch(Exception e) {
			System.out.println(e);
			return null;
		}
	}
	
	public Pedido findPedidoById(Long id) {
		try {
			Pedido pedido = repo.findById(id).orElseThrow(); return pedido;
			} catch (Exception e) {
			return null;
			}
	}
	
	public boolean atualizarStatus(Long id,int newStatus) {
		try {
			Pedido pedido = repo.findById(id).orElseThrow(); 
			
			pedido.setStatus(newStatus);
			return true;
			} catch (Exception e) {
			return false;
			}
	}
	
	private String randomCodigo() {
		return "";
	}
}
