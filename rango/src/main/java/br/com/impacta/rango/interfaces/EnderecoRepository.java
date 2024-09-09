package br.com.impacta.rango.interfaces;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.impacta.rango.dto.RegisterEnderecoDTO;
import br.com.impacta.rango.dto.RegisterEnderecoResDTO;
import br.com.impacta.rango.entities.Endereco;
import br.com.impacta.rango.entities.Restaurante;
import br.com.impacta.rango.entities.Usuario;

@Service
public class EnderecoRepository {
	// Raio da Terra em quilômetros
    private static final double EARTH_RADIUS_KM = 6371.0;
    
	@Autowired
	private IEnderecoRepository repo;
	
	@Autowired
	private IUserRepository userRepo;
	
	@Autowired
	private IRestauranteRepository resRepo;

	
	public boolean saveEnderecoRestaurante(RegisterEnderecoResDTO data) {
		Restaurante restaurante = null;
		try {
			//primeiro verifica se o restaurante existe ou lança erro;
			restaurante = resRepo.findById(data.idRestaurante()).orElseThrow();
			
			//segundo verifica se o endereço já existe, se sim ele será atualizado
			Endereco endereco = repo.findById(data.idEndereco()).orElseThrow();
			
			endereco.setLogradouro(data.logradouro());
			endereco.setCep(data.cep());
			endereco.setNumero(data.numero());
			endereco.setBairro(data.bairro());
			endereco.setCidade(data.cidade());
			endereco.setEstado(data.estado());
			endereco.setLatitude(data.latitude());
			endereco.setLongitude(data.longitude());
			repo.save(endereco);
			
			return true;	
		} catch(NoSuchElementException e) {
			// se cair aqui irá verificar se é o exception do restaurante, se for irá retornar erro
			// se for o exception do endereço, será criado pela primeira vez o endereço do restaurante
			if(restaurante != null) {
				System.out.println("caiu aqui");
				Endereco newEndereco = new Endereco();
				newEndereco.setLogradouro(data.logradouro());
				newEndereco.setCep(data.cep());
				newEndereco.setNumero(data.numero());
				newEndereco.setBairro(data.bairro());
				newEndereco.setCidade(data.cidade());
				newEndereco.setEstado(data.estado());
				newEndereco.setRestaurante(restaurante);
				newEndereco.setSelecionado(false);
				newEndereco.setCasa(false);
				newEndereco.setTrabalho(false);
				newEndereco.setLatitude(data.latitude());
				newEndereco.setLongitude(data.longitude());
				repo.save(newEndereco);
				return true;	
			}
			return false;
		}
	}
	
	public boolean saveEndereco(RegisterEnderecoDTO data) {
		Endereco newEndereco = new Endereco();
		Usuario usuario = userRepo.findById(data.idUsuario()).orElseThrow();
		
		repo.desmarcarTodos(usuario.getIdUsuario());
		
		newEndereco.setLogradouro(data.logradouro());
		newEndereco.setNumero(data.numero());
		newEndereco.setBairro(data.bairro());
		newEndereco.setCidade(data.cidade());
		newEndereco.setEstado(data.estado());
		newEndereco.setSelecionado(true);
		newEndereco.setCasa(data.casa());
		newEndereco.setTrabalho(data.trabalho());
		newEndereco.setUsuario(usuario);
		newEndereco.setLatitude(data.latitude());
		newEndereco.setLongitude(data.longitude());
		repo.save(newEndereco);
		
		return true;
	}
	
	public void atualizarEndereco(Long idSelecionado) {
        // Primeiro, desmarque todos os endereços
        repo.desmarcarTodosExceto(idSelecionado);

        // Em seguida, marque o endereço selecionado
        repo.marcarComoSelecionado(idSelecionado);
    }
	
	public boolean editEndereco(Long idEndereco,RegisterEnderecoDTO data) {
		try {
			Endereco newEndereco = repo.findById(idEndereco).orElseThrow();
			
			Usuario usuario = userRepo.findById(data.idUsuario()).orElseThrow();
			
			repo.desmarcarTodos(usuario.getIdUsuario());
			
			newEndereco.setLogradouro(data.logradouro());
			newEndereco.setNumero(data.numero());
			newEndereco.setBairro(data.bairro());
			newEndereco.setCidade(data.cidade());
			newEndereco.setEstado(data.estado());
			newEndereco.setSelecionado(true);
			newEndereco.setCasa(data.casa());
			newEndereco.setTrabalho(data.trabalho());
			newEndereco.setUsuario(usuario);
			repo.save(newEndereco);
			
			return true;		
		} catch(Exception e) {
			return false;
		}
	}
	
	public boolean removeEndereco(Long idEndereco) {
		try {
			Endereco newEndereco = repo.findById(idEndereco).orElseThrow();
			repo.delete(newEndereco);;
			
			return true;		
		} catch(Exception e) {
			return false;
		}

	}

}
