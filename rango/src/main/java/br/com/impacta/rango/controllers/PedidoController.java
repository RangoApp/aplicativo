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

import br.com.impacta.rango.config.EmailConfig;
import br.com.impacta.rango.dto.email.EmailDTO;
import br.com.impacta.rango.dto.pedidos.StatusDTO;
import br.com.impacta.rango.entities.Pedido;
import br.com.impacta.rango.entities.Produto;
import br.com.impacta.rango.repositories.PedidoRepository;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {
	
	@Autowired
	private PedidoRepository repo;
	
	@Autowired
	private EmailConfig emailConfig;
	
	
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
	
	@PutMapping("/confirmar/{id}/{codigo}")
	public ResponseEntity<String> atualizaStatus(@RequestHeader("Authorization") String token, @PathVariable Long id, @PathVariable String codigo ) {
		if(repo.confirmar(id, codigo)) {
			return ResponseEntity.ok ("Status atualizado com sucesso");
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro ao atualizar status");
	}
	
	
	@PostMapping("/email/{id}/{status}")
	public ResponseEntity<String> enviaEmail(@RequestHeader("Authorization") String token ,@PathVariable int status,@PathVariable Long id,@RequestBody EmailDTO emailDto) {
		if(status==3) {
			repo.pedidoEntregue(id);
		}
		String statusMsg = status == 1 ? "Pedido foi confirmado pelo restaurante e estará sendo preparado" : status == 2 ? "Pedido foi preparado" : "Pedido entregue";
		
		emailConfig.sendEmail("Rango", "lucasyudi7@gmail.com", emailDto.email(), "Rango - Status do Pedido", statusMsg);
		return ResponseEntity.ok ("Status atualizado com sucesso");
	}
}
