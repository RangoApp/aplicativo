package br.com.impacta.rango.repositories;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.impacta.rango.entities.Cartao;
import br.com.impacta.rango.entities.Restaurante;
import br.com.impacta.rango.entities.Usuario;
import br.com.impacta.rango.interfaces.ICartaoRepository;
import br.com.impacta.rango.interfaces.IUserRepository;

@Service
public class CartaoRepository {
	@Autowired
	private ICartaoRepository repo;
	
	@Autowired
	private IUserRepository usuRepo;
	
	public boolean saveCartao(Long id,Cartao cartao) {
		try {
			Cartao newData = new Cartao();
			newData.setNumero(cartao.getNumero()); 
			newData.setDtVal(cartao.getDtVal());
			newData.setNome(cartao.getNome());
			newData.setCod(cartao.getCod());

			Usuario usuario = new Usuario();
			usuario.setIdUsuario(id);
			newData.setUsuario(usuario); 
			repo.save(newData);
			return true;
		} catch (Exception e) {
			return false;
		}
	}
	
	public List<Cartao> getCartoes(Long id) {
		try {
			Usuario usuario = usuRepo.findById(id).orElseThrow();
			List<Cartao> cartoes = repo.findByUsuario(usuario);
			System.out.println(cartoes.size());
			return cartoes;
		} catch(Exception e) {
			System.out.println(e);
			return null;
		}
	}
	
	public boolean updateCartao(Long id, Cartao cartao) {
		try {
		Cartao newData = repo.findById(id).orElseThrow();
		newData.setNumero(cartao.getNumero()); 
		newData.setDtVal(cartao.getDtVal());
		newData.setNome(cartao.getNome());
		newData.setCod(cartao.getCod());
		repo.save(newData);
		return true;
		} catch(Exception e) {
			return false;
		}
		
	}
	
	public boolean removeCartao(Long id) {
		try {
		Cartao cartao = repo.findById(id).orElseThrow();
		repo.delete(cartao);
		return true;
		} catch(Exception e) {
			return false;
		}
		
	}
}
