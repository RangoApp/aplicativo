package br.com.impacta.rango.interfaces;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.impacta.rango.entities.ItemPedido;

public interface IItemPedidoRepository extends JpaRepository<ItemPedido, Long>{

}
