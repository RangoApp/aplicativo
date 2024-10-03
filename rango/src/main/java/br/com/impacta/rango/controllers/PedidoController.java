package br.com.impacta.rango.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import br.com.impacta.rango.entities.Pedido;
import br.com.impacta.rango.repositories.PedidoRepository;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {
	
	@Autowired
	private PedidoRepository repo;
	
	@PostMapping
	public ResponseEntity<String> savePedido (@RequestHeader("Authorization") String token, @RequestBody Pedido data) { 
		if (repo.savePedido(data)) {
			return ResponseEntity.ok("Pedido cadastrado com sucesso");
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST) .body ("Verificar dados do Pedido");
	}
}
