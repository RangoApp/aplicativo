package br.com.impacta.rango.repositories;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import br.com.impacta.rango.dto.EnderecoResponseDTO;
import br.com.impacta.rango.dto.RestauranteRegisterDTO;
import br.com.impacta.rango.dto.RestauranteResponseDTO;
import br.com.impacta.rango.dto.UserResponseDTO;
import br.com.impacta.rango.entities.Endereco;
import br.com.impacta.rango.entities.Restaurante;
import br.com.impacta.rango.entities.Usuario;
import br.com.impacta.rango.interfaces.IRestauranteRepository;

@Service
public class RestauranteRepository {

	@Autowired
	private IRestauranteRepository resRepo;
	
	private static Double KM_LIMITE = 100.0;
	
	public Page<Restaurante> findEnderecosRestaurantes(Double lat, Double lng,Pageable pageable) {
		// Uso de KM_LIMITE no Hardcode para Restaurantes próximos;
		Page<Restaurante> enderecos = resRepo.buscaEnderecosProximos(lat,lng,KM_LIMITE,pageable);
		return enderecos;
	}
	
	public Long saveRestaurante(RestauranteRegisterDTO data) {
		Restaurante newRestaurante = new Restaurante();
		newRestaurante.setNomeRes(data.nomeRes());
		newRestaurante.setDescrRes(data.descrRes());
		newRestaurante.setCnpj(data.cnpj());
		newRestaurante.setCategoria(data.categoria());
		newRestaurante.setPrecoMinimo(data.precoMinimo());
		newRestaurante.setImg(data.img());
		newRestaurante.setBanner(data.banner());
		
		
		try {
			return resRepo.save(newRestaurante).getIdRestaurante();
			
		} catch(Exception e) {
			return null;
		}
	}
	
	public boolean editRestaurante(Long idRestaurante,RestauranteRegisterDTO data) {
		try {
			Restaurante res =  resRepo.findById(idRestaurante).orElseThrow();
			
			res.setNomeRes(data.nomeRes());
			res.setDescrRes(data.descrRes());
			res.setCnpj(data.cnpj());
			res.setCategoria(data.categoria());
			res.setPrecoMinimo(data.precoMinimo());
			res.setImg(data.img());
			res.setBanner(data.banner());
			resRepo.save(res);
			return true;
		} catch(NoSuchElementException e) {
			return false;
		}
	}
	
	public boolean removeRestaurante(Long idRestaurante) {
		try {
			Restaurante res =  resRepo.findById(idRestaurante).orElseThrow();
			resRepo.delete(res);
			return true;
		} catch(NoSuchElementException e) {
			return false;
		}
	}
	
	public RestauranteResponseDTO findRestauranteById(Long idRestaurante) {
		try {
			Restaurante res =  resRepo.findById(idRestaurante).orElseThrow();
			return new RestauranteResponseDTO(
					res.getIdRestaurante(),
					res.getNomeRes(),
					res.getDescrRes(),
					res.getCnpj(),
					res.getCategoria(),
					res.getPrecoMinimo(),
					res.getProdutos(),
					res.getImg(),
					res.getBanner());
		} catch(NoSuchElementException e) {
			return null;
		}
	}
	
}
