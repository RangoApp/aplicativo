package br.com.impacta.rango.interfaces;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.impacta.rango.entities.Produto;

public interface IProdutoRepository extends JpaRepository<Produto, Long> {

}
