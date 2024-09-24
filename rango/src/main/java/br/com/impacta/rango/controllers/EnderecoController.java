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

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;

import br.com.impacta.rango.dto.CoordenadasDTO;
import br.com.impacta.rango.dto.EditUserRequestDTO;
import br.com.impacta.rango.dto.RegisterEnderecoDTO;
import br.com.impacta.rango.dto.RegisterEnderecoResDTO;
import br.com.impacta.rango.entities.Endereco;
import br.com.impacta.rango.repositories.EnderecoRepository;

@RestController
@RequestMapping("/enderecos")
public class EnderecoController {

	@Autowired
	private EnderecoRepository repo;
	
	@PostMapping
	public ResponseEntity<String> saveEndereco(@RequestHeader("Authorization") String token,@RequestBody RegisterEnderecoDTO data) {
		
	    if(repo.saveEndereco(data)) {
	    	return ResponseEntity.ok("Endereço cadastrado com sucesso");
	    };
	  
	    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Não foi possível cadastrar o endereço");

	}
	
	@PostMapping("/restaurantes")
	public ResponseEntity<String> saveEnderecoRestaurante(@RequestHeader("Authorization") String token,@RequestBody RegisterEnderecoResDTO data) {
        if(repo.saveEnderecoRestaurante(data)) {
        	return ResponseEntity.ok("Endereço cadastrado com sucesso");
        };
      
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Não foi possível cadastrar o endereço");
	}
	
	@PutMapping("{id}")
	ResponseEntity<String> editEndereco(@RequestHeader("Authorization") String token,@PathVariable Long id, @RequestBody RegisterEnderecoDTO data) {
        if(repo.editEndereco(id,data)) {
        	return ResponseEntity.ok("Endereço atualizado com sucesso");
        };
      
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Não foi possível cadastrar o endereço");
    	
	}
	
	@DeleteMapping("{id}")
	ResponseEntity<String> deleteEndereco(@RequestHeader("Authorization") String token,@PathVariable Long id) {
        if(repo.removeEndereco(id)) {
        	return ResponseEntity.ok("Endereço atualizado com sucesso");
        };
      
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Não foi possível cadastrar o endereço");

	}
	
	
}
