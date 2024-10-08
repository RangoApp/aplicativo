package br.com.impacta.rango.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

import br.com.impacta.rango.dto.enderecos.CoordenadasDTO;
import br.com.impacta.rango.dto.enderecos.EnderecoRegisterDTO;
import br.com.impacta.rango.dto.restaurantes.RestauranteRegisterDTO;
import br.com.impacta.rango.dto.restaurantes.RestauranteResponseDTO;
import br.com.impacta.rango.dto.usuarios.UsuarioEditRequestDTO;
import br.com.impacta.rango.entities.Endereco;
import br.com.impacta.rango.entities.Restaurante;
import br.com.impacta.rango.repositories.EnderecoRepository;
import br.com.impacta.rango.repositories.RestauranteRepository;

@RestController
@RequestMapping("/restaurantes")
public class RestauranteController {

	@Autowired
	private RestauranteRepository repo;
	
	@PostMapping
	public ResponseEntity<Long> saveRestaurantes(@RequestHeader("Authorization") String token,@RequestBody RestauranteRegisterDTO data) {
		Long id = repo.saveRestaurante(data);
        if(id != null) {
        	return ResponseEntity.ok(id);	
        } 
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
	}
	
	@PutMapping("{id}")
	ResponseEntity<String> editRestaurante(@RequestHeader("Authorization") String token,@PathVariable Long id, @RequestBody RestauranteRegisterDTO data) {
		
        if(repo.editRestaurante(id,data)) {
        	return ResponseEntity.ok("Restaurante atualizado com sucesso");
        };
      
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Não foi possível editar o restaurante");
	}
	
	@GetMapping("{id}")
	ResponseEntity<RestauranteResponseDTO> findRestaurante(@RequestHeader("Authorization") String token,@PathVariable Long id) {
        RestauranteResponseDTO res = repo.findRestauranteById(id);
        if(res == null) {
        	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);	
        }
        return ResponseEntity.ok(res);
	}
	
	@DeleteMapping("{id}")
	ResponseEntity<String> removeRestaurante(@RequestHeader("Authorization") String token,@PathVariable Long id) {
        if(repo.removeRestaurante(id)) {
        	 return ResponseEntity.ok("Restaurante deletado com sucesso");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Não foi possível deletar o restaurante");	
	}
	
	@GetMapping("/proximos/{latitude}/{longitude}/{pagina}")
    public ResponseEntity<Page<Restaurante>> findRestaurantesProximos(
            @RequestHeader("Authorization") String token,
            @PathVariable Double latitude,
            @PathVariable Double longitude,
            @PathVariable int pagina) {

        Pageable pageable = PageRequest.of(pagina, 20); // Cria o Pageable com a página e tamanho
        Page<Restaurante> restaurantes = repo.findEnderecosRestaurantes(latitude, longitude, pageable);
        
        return ResponseEntity.ok(restaurantes);
    }
}
