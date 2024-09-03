package br.com.impacta.rango.interfaces;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.impacta.rango.entities.Endereco;
import jakarta.transaction.Transactional;

public interface IEnderecoRepository extends JpaRepository<Endereco, Long>  {
	   // Desmarcar todos os endereços como false, exceto o especificado
	
	@Modifying
    @Transactional
    @Query("UPDATE Endereco e SET e.selecionado = false WHERE e.usuario.idUsuario = :idUsuario")
    void desmarcarTodos(@Param("idUsuario") Long idUsuario);
	
    @Modifying
    @Transactional
    @Query("UPDATE Endereco e SET e.selecionado = false WHERE e.idEndereco <> :id")
    void desmarcarTodosExceto(@Param("id") Long id);

    // Marcar um endereço específico como true
    @Modifying
    @Transactional
    @Query("UPDATE Endereco e SET e.selecionado = true WHERE e.idEndereco = :id")
    void marcarComoSelecionado(@Param("id") Long id);
}
