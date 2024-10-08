package br.com.impacta.rango.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.impacta.rango.dto.pedidos.StatusDTO;
import br.com.impacta.rango.entities.Pedido;
import br.com.impacta.rango.entities.Produto;
import br.com.impacta.rango.repositories.PedidoRepository;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {
	
	@Autowired
	private PedidoRepository repo;
	
	@PostMapping
	public ResponseEntity<Long> savePedido (@RequestHeader("Authorization") String token, @RequestBody Pedido data) { 
		Long id = repo.savePedido(data);
		if (id != null) {
			return ResponseEntity.ok(id);
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST) .body (null);
	}
	
	@GetMapping("{id}")
	public ResponseEntity<Pedido> getPedidoById(@RequestHeader("Authorization") String token, @PathVariable Long id) {
		Pedido res = repo.findPedidoById(id);
		if (res != null) {
			return ResponseEntity.ok (res);
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
	}
	
	@PutMapping("/status/{id}")
	public ResponseEntity<String> atualizaStatus(@RequestHeader("Authorization") String token, @PathVariable Long id, @RequestBody StatusDTO statusDto ) {
		if(repo.atualizarStatus(id, statusDto.status())) {
			return ResponseEntity.ok ("Status atualizado com sucesso");
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro ao atualizar status");
	}
}
