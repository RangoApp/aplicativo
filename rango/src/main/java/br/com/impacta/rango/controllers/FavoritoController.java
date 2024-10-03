package br.com.impacta.rango.controllers;

import br.com.impacta.rango.dto.RegisterFavoritoDTO;
import br.com.impacta.rango.entities.Favorito;
import br.com.impacta.rango.entities.Restaurante;
import br.com.impacta.rango.entities.Usuario;
import br.com.impacta.rango.interfaces.IFavoritoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/favoritos")
public class FavoritoController {

    @Autowired
    private IFavoritoRepository favRepo;

    @PostMapping
    public ResponseEntity<Favorito> adicionarFavorito(@RequestBody RegisterFavoritoDTO data) {
        // Cria um objeto Usuario e define o ID usando o setter
        Usuario usuario = new Usuario();
        usuario.setIdUsuario(data.idUsuario());  // Define o ID do usuário

        // Cria um objeto Restaurante e define o ID usando o setter
        Restaurante restaurante = new Restaurante();
        restaurante.setIdRestaurante(data.idRestaurante());  // Define o ID do restaurante

        // Cria o objeto Favorito
        Favorito favorito = new Favorito(
                // Passa o objeto Restaurante
        );

        // Salva o favorito no banco de dados
        Favorito novoFavorito = favRepo.save(favorito);

        // Retorna o favorito criado com status 201
        return new ResponseEntity<>(novoFavorito, HttpStatus.CREATED);
    }

    @GetMapping("/{idUsuario}")
    public ResponseEntity<List<Favorito>> listarFavoritosPorUsuario(@PathVariable Long idUsuario) {
        List<Favorito> favoritos = favRepo.findByUsuario_IdUsuario(idUsuario);
        if (favoritos.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(favoritos, HttpStatus.OK);
    }

    @DeleteMapping("/{idFavorito}")
    public ResponseEntity<Void> desfavoritar(@PathVariable Long idFavorito) {
        favRepo.deleteById(idFavorito);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
