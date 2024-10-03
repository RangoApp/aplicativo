package br.com.impacta.rango.interfaces;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.impacta.rango.entities.Pedido;

public interface IPedidoRepository extends JpaRepository<Pedido,Long> {

}
