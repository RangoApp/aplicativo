package br.com.impacta.rango.repositories;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Random;

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
			pedido.setStatus(0);
			pedido.setCodigo(generateRandomCode());
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
	
	public boolean confirmar(Long id,String codigo) {
		try {
			Pedido pedido = repo.findById(id).orElseThrow(); 
			if(pedido.getCodigo().equals(codigo) && pedido.getStatus() == 2) {
				pedido.setStatus(3);
				repo.save(pedido);
				return true;
			}
			return false;
			} catch (Exception e) {
			return false;
			}
	}
	
	public void pedidoEntregue(Long id) {
		try {
			Pedido pedido = repo.findById(id).orElseThrow(); 
			
				pedido.setStatus(2);
				repo.save(pedido);
				
			} catch (Exception e) {
			
			}
	}
	
	private String generateRandomCode() {
		 // Cria um objeto Random
      Random random = new Random();

      // Gera um número aleatório de 0 a 999999 (6 dígitos)
      int randomNumber = random.nextInt(999999);

      // Formata o número para sempre ter 6 dígitos
      String formattedNumber = String.format("%06d", randomNumber);
      return formattedNumber;
	}
}
