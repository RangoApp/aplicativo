package br.com.impacta.rango.repositories;

import java.sql.Timestamp;
import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.impacta.rango.entities.ItemPedido;
import br.com.impacta.rango.entities.Pedido;
import br.com.impacta.rango.interfaces.IPedidoRepository;

@Service
public class PedidoRepository {
	@Autowired
	private IPedidoRepository repo;
	
	public boolean savePedido(Pedido pedido) {
		try {
		 for (ItemPedido item : pedido.getItens()) {
		        item.setPedido(pedido);  // Associa o pedido a cada item
		    }
			pedido.setDtNeg(Timestamp.from(Instant.now()));
			repo.save(pedido);
			return true;
		} catch(Exception e) {
			System.out.println(e);
			return false;
		}
	}
}
