package br.com.impacta.rango.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.impacta.rango.interfaces.IItemPedidoRepository;

@Service
public class ItemPedidoRepository {

	@Autowired
	private IItemPedidoRepository repo;
}
