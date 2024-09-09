package br.com.impacta.rango.interfaces;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.impacta.rango.dto.EnderecoResponseDTO;
import br.com.impacta.rango.dto.RestauranteRegisterDTO;
import br.com.impacta.rango.dto.RestauranteResponseDTO;
import br.com.impacta.rango.dto.UserResponseDTO;
import br.com.impacta.rango.entities.Endereco;
import br.com.impacta.rango.entities.Restaurante;
import br.com.impacta.rango.entities.Usuario;

@Service
public class RestauranteRepository {

	@Autowired
	private IRestauranteRepository resRepo;
	
	private static Double KM_LIMITE = 30.0;
	
	public List<Restaurante> findEnderecosRestaurantes(Double lat, Double lng) {
		// Uso de KM_LIMITE no Hardcode para Restaurantes próximos;
		List<Restaurante> enderecos = resRepo.buscaEnderecosProximos(lat,lng,KM_LIMITE);
		return enderecos;
	}
	
	public boolean saveRestaurante(RestauranteRegisterDTO data) {
		Restaurante newRestaurante = new Restaurante();
		newRestaurante.setNomeRes(data.nomeRes());
		newRestaurante.setDescrRes(data.descrRes());
		newRestaurante.setCnpj(data.cnpj());
		
		try {
			resRepo.save(newRestaurante);
			return true;
		} catch(Exception e) {
			return false;
		}
	}
	
	public boolean editRestaurante(Long idRestaurante,RestauranteRegisterDTO data) {
		try {
			Restaurante res =  resRepo.findById(idRestaurante).orElseThrow();
			
			res.setNomeRes(data.nomeRes());
			res.setDescrRes(data.descrRes());
			res.setCnpj(data.cnpj());
			
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
					res.getCnpj());
		} catch(NoSuchElementException e) {
			return null;
		}
	}
	
}
