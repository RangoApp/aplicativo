package br.com.impacta.rango.interfaces;

import br.com.impacta.rango.entities.Favorito;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IFavoritoRepository extends JpaRepository<Favorito, Long> {
    List<Favorito> findByUsuario_IdUsuario(Long idUsuario);
}
