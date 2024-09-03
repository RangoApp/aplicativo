package br.com.impacta.rango.controllers;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;

import br.com.impacta.rango.dto.EditUserRequestDTO;
import br.com.impacta.rango.dto.UserResponseDTO;
import br.com.impacta.rango.interfaces.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {
	
	@Autowired
	private UserRepository repo;
    
    @PutMapping("{id}")
    public ResponseEntity<String> editUser(@RequestHeader("Authorization") String token, @PathVariable Long id,@RequestBody EditUserRequestDTO data) {
    	try {
    		String idToken = token.replace("Bearer ", "");
	        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
	        if(repo.editUser(id, data,decodedToken.getEmail())) {
	        	return ResponseEntity.ok("Usuário atualizado com sucesso");
	        };
          
	          return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Não foi possível alterar o usuário");
    	} catch (FirebaseAuthException e) {
    		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
    	}
    }
    
    @GetMapping("{id}")
    public ResponseEntity<UserResponseDTO> findById(@RequestHeader("Authorization") String token, @PathVariable Long id) {
    	try {
    		String idToken = token.replace("Bearer ", "");
	        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
	        UserResponseDTO user = repo.findUserById(id, decodedToken.getEmail());

	        return ResponseEntity.ok(user);
    	}catch (FirebaseAuthException e) {
    		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    	}
    }
}
