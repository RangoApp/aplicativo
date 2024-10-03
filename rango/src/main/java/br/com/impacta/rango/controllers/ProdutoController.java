package br.com.impacta.rango.controllers;

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
import br.com.impacta.rango.entities.Produto;
import br.com.impacta.rango.repositories.ProdutoRepository;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

	@Autowired
	private ProdutoRepository repo;
	
	@PostMapping
	public ResponseEntity<String> saveProduto (@RequestHeader("Authorization") String token, @RequestBody ProdutoRegisterDTO data) { 
		if (repo.saveProduto(data)) {
			return ResponseEntity.ok("Produto cadastrado com sucesso");
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST) .body ("Verificar dados do Produto");
	}


	@PutMapping("{id}")
	ResponseEntity<String> editRestaurante (@RequestHeader("Authorization") String token, @PathVariable Long id, @RequestBody ProdutoRegisterDTO data){
	if (repo.editProduto(id, data)) {
		return ResponseEntity.ok("Produto atualizado com sucesso");
	}
	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Não foi possível editar o Produto");
	}
	
	@GetMapping("{id}")
	ResponseEntity<Produto> findRestaurante (@RequestHeader("Authorization") String token, @PathVariable Long id) { 
		Produto res = repo.findProdutoById(id);
		if (res == null) {
			return ResponseEntity.ok (res);
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
	}
	
	@DeleteMapping("{id}")
	ResponseEntity<String> removeRestaurante (@RequestHeader("Authorization") String token, @PathVariable Long id) { 
		if (repo.removeProduto (id)) {
			return ResponseEntity.ok("Produto deletado com sucesso");
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST) .body ("Não foi possível deletar o Produto");
	}	
}
