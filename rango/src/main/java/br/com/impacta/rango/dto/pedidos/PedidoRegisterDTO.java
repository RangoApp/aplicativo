package br.com.impacta.rango.dto.pedidos;

import java.util.List;

import br.com.impacta.rango.entities.ItemPedido;

public record PedidoRegisterDTO(double frete, List<ItemPedido> itens) {

}
