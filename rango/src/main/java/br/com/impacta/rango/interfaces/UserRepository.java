package br.com.impacta.rango.interfaces;

import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.impacta.rango.dto.EditUserRequestDTO;
import br.com.impacta.rango.dto.EnderecoResponseDTO;
import br.com.impacta.rango.dto.UserResponseDTO;
import br.com.impacta.rango.entities.Endereco;
import br.com.impacta.rango.entities.Usuario;

@Service
public class UserRepository {
	@Autowired
	private IUserRepository repo;
	
	public boolean editUser(Long idUsuario,EditUserRequestDTO userDto,String email) {
		try {
			Usuario user = repo.findById(idUsuario).orElseThrow();
			if(user.getEmail().equals(email)) {
				user.setCpf(userDto.cpf());
				user.setNomeCompleto(userDto.nomeCompleto());
				repo.save(user);
				return true;
			} 
			return false;
		} catch(NoSuchElementException e) {
			return false;
		} catch(Exception e) {
			return false;
		}
	}
	
	public UserResponseDTO findUserById(Long idUsuario, String email) {
		try {
			Usuario user = repo.findById(idUsuario).orElseThrow();
			if(user.getEmail().equals(email)) {
				List<EnderecoResponseDTO> enderecoDTOs = user.getEnderecos().stream()
			            .sorted(Comparator.comparing(Endereco::isSelecionado).reversed()) // Ordena por 'selecionado' (principal) primeiro
			            .map(endereco -> new EnderecoResponseDTO(
			            		endereco.getIdEndereco(),
			                endereco.getLogradouro(),
			                endereco.getNumero(),
			                endereco.getBairro(),
			                endereco.getCidade(),
			                endereco.getEstado(),
			                endereco.isSelecionado(),
			                endereco.isCasa(),
			                endereco.isTrabalho(),
			                endereco.getLatitude(),
			                endereco.getLongitude(),
			                endereco.getComplemento(),
			                endereco.getPontoReferencia()
			            ))
			            .collect(Collectors.toList());

	            return new UserResponseDTO(
	            		user.getIdUsuario(),
	                    user.getNomeCompleto(),
	                    user.getEmail(),
	                    user.getTelefone(),
	                    user.getCpf(),
	                    enderecoDTOs
	            );
			} 
			return null;
		} catch(NoSuchElementException e) {
			return null;
		} catch(Exception e) {
			return null;
		}
	}
}
