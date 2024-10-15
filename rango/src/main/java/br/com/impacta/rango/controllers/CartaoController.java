package br.com.impacta.rango.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.impacta.rango.dto.produtos.ProdutoRegisterDTO;
import br.com.impacta.rango.entities.Cartao;
import br.com.impacta.rango.entities.Produto;
import br.com.impacta.rango.repositories.CartaoRepository;
import br.com.impacta.rango.repositories.EnderecoRepository;

@RestController
@RequestMapping("/cartoes")
public class CartaoController {
	

	@Autowired
	private CartaoRepository repo;

	@PostMapping("{id}")
	public ResponseEntity<String> saveCartao (@RequestHeader("Authorization") String token, @RequestBody Cartao data,@PathVariable Long id) { 
		if (repo.saveCartao(id,data)) {
			return ResponseEntity.ok("Cartão cadastrado com sucesso");
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST) .body ("Verificar dados do Cartão");
	}


	@PutMapping("{id}")
	ResponseEntity<String> editCartao (@RequestHeader("Authorization") String token, @PathVariable Long id, @RequestBody Cartao data){
	if (repo.updateCartao(id, data)) {
		return ResponseEntity.ok("Cartão atualizado com sucesso");
	}
	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Não foi possível editar o Produto");
	}
	
	@GetMapping("{id}")
	ResponseEntity<List<Cartao>> findCartao (@RequestHeader("Authorization") String token, @PathVariable Long id) { 
		List<Cartao> res = repo.getCartoes(id);
		if (res != null) {
			return ResponseEntity.ok (res);
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
	}
	
	@DeleteMapping("{id}")
	ResponseEntity<String> removeCartao (@RequestHeader("Authorization") String token, @PathVariable Long id) { 
		if (repo.removeCartao (id)) {
			return ResponseEntity.ok("Cartão deletado com sucesso");
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST) .body ("Não foi possível deletar o Produto");
	}	
}
