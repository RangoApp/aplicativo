package br.com.impacta.rango.interfaces;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.impacta.rango.entities.Cartao;
import br.com.impacta.rango.entities.Usuario;

public interface ICartaoRepository extends JpaRepository<Cartao, Long> {
	// Busca todos os cartões de um usuário específico
    List<Cartao> findByUsuario(Usuario usuario);
}
