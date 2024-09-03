package br.com.impacta.rango.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;

import br.com.impacta.rango.dto.EditUserRequestDTO;
import br.com.impacta.rango.dto.RegisterEnderecoDTO;
import br.com.impacta.rango.interfaces.EnderecoRepository;

@RestController
@RequestMapping("/enderecos")
public class EnderecoController {

	@Autowired
	private EnderecoRepository repo;
	
	@PostMapping
	public ResponseEntity<String> saveEndereco(@RequestHeader("Authorization") String token,@RequestBody RegisterEnderecoDTO data) {
		try {
    		String idToken = token.replace("Bearer ", "");
	        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
	        if(repo.saveEndereco(data)) {
	        	return ResponseEntity.ok("Endereço cadastrado com sucesso");
	        };
          
	          return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Não foi possível cadastrar o endereço");
    	} catch (FirebaseAuthException e) {
    		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
    	}
	}
}
