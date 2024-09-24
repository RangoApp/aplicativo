package br.com.impacta.rango.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.impacta.rango.dto.ProdutoRegisterDTO;
import br.com.impacta.rango.entities.Produto;
import br.com.impacta.rango.entities.Restaurante;
import br.com.impacta.rango.interfaces.IProdutoRepository;
import br.com.impacta.rango.interfaces.IRestauranteRepository;

@Service
public class ProdutoRepository {

	@Autowired
	private IProdutoRepository repo;
	@Autowired
	private IRestauranteRepository resRepo;
	
	public boolean saveProduto (ProdutoRegisterDTO data) { 
		Produto newProduto = new Produto();
		newProduto.setNomeProduto(data.nomeProduto()); 
		newProduto.setDescricao(data.descricao());
		newProduto.setImg (data.img());
		try {
			Restaurante restaurante = resRepo.findById(data.idRestaurante()).orElseThrow();
			newProduto.setRestaurante(restaurante); 
			repo.save(newProduto);
			return true;
		} catch (Exception e) {
			return false;
		}
	}
	
	public Produto findProdutoById(Long idProduto) {
		try {
		Produto produto = repo.findById(idProduto).orElseThrow(); return produto;
		} catch (Exception e) {
		return null;
		}
	}
		public boolean editProduto (Long idProduto, ProdutoRegisterDTO data) { try {
		Produto produto = repo.findById(idProduto).orElseThrow(); produto.setNomeProduto (data.nomeProduto()); produto.setDescricao (data.descricao());
		produto.setImg (data.img()); repo.save(produto);
		return true;
		} catch (Exception e) {
		return false;
		}
		}
		
		public boolean removeProduto (Long idProduto) {
		try {
		Produto produto = repo.findById(idProduto).orElseThrow(); 
		repo.delete(produto);
		return true;
		} catch (Exception e) {
		}
		return false;
		}
}
