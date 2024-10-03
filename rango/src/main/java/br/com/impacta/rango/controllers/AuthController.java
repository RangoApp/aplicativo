package br.com.impacta.rango.controllers;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.auth.UserRecord.CreateRequest;

import br.com.impacta.rango.dto.email.EmailDTO;
import br.com.impacta.rango.dto.usuarios.UsuarioEmailRegisterDTO;
import br.com.impacta.rango.dto.usuarios.UsuarioRegisterResponseDTO;
import br.com.impacta.rango.entities.Usuario;
import br.com.impacta.rango.interfaces.IUserRepository;
import br.com.impacta.rango.repositories.EmailOTPRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
	
	@Autowired
	private IUserRepository repo;

	@Autowired
	private EmailOTPRepository emailRepo;

    @PostMapping("/register")
    public ResponseEntity<UsuarioRegisterResponseDTO> register(@RequestHeader("Authorization") String token) {
        try {
        	 // Remover o prefixo 'Bearer ' do token
            String idToken = token.replace("Bearer ", "");
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            String uid = decodedToken.getUid();
            String email = decodedToken.getEmail();
            UserRecord userRecord = FirebaseAuth.getInstance().getUser(uid);
            Usuario oldUser = repo.findByEmail(email);
            Long id = null;
            
            boolean hasEndereco = false;
            if(oldUser==null) {
            	Usuario newUser = new Usuario();
                
                newUser.setEmail(email);
                newUser.setTelefone(userRecord.getPhoneNumber());
                
                Usuario user = repo.save(newUser);	
                id = user.getIdUsuario();
            } else {
            	id = oldUser.getIdUsuario();
            	
            	hasEndereco = !(oldUser.getEnderecos().isEmpty());
            }
            
            UsuarioRegisterResponseDTO response = new UsuarioRegisterResponseDTO(id,hasEndereco);
            
            return ResponseEntity.ok(response);
        } catch (FirebaseAuthException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }
    
    @PostMapping("/sendEmailVerification")
    public ResponseEntity<String> sendEmailVerification(@RequestBody EmailDTO emailDto) {
    	try {
    		emailRepo.sendCodeToEmail(emailDto.email());
	         // Requisição autenticada com sucesso
	         return ResponseEntity.ok("Email enviado");
    	} catch(Exception e) {
    		  return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro: Email don't send");
    	}
    }
    
    @PostMapping("/verificateEmailCode")
    public ResponseEntity<String> verificateEmailCode(@RequestBody UsuarioEmailRegisterDTO reg) {
    	String email = reg.email();
    	if(emailRepo.verifyCode(email, reg.code())) {
    		
    		try {
    		 Usuario oldUser = repo.findByEmail(email);
    		 UserRecord userRecord = null;
    		if(oldUser== null) {
    			CreateRequest user = new CreateRequest();
            	user.setEmail(reg.email());
            	user.setEmailVerified(true);	
            	userRecord = FirebaseAuth.getInstance().createUser(user);
    		} else {
    			userRecord = FirebaseAuth.getInstance().getUserByEmail(email);
    		}
    			String customToken = FirebaseAuth.getInstance().createCustomToken(userRecord.getUid());
        	
                return ResponseEntity.ok(customToken);
        	} catch(FirebaseAuthException e) {
        	    return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body("Error: Server Off");
        	}	
    	} else {
    		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid code or dt expirated");
    	}
    }
}
