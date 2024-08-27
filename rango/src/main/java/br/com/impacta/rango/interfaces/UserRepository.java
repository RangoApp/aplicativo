package br.com.impacta.rango.interfaces;

import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.impacta.rango.dto.EditUserRequestDTO;
import br.com.impacta.rango.dto.UserResponseDTO;
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
				UserResponseDTO userDto = new UserResponseDTO(
						user.getNomeCompleto(),
						user.getEmail(),
						user.getTelefone(),
						user.getCpf()
						);
						
				return userDto;
			} 
			return null;
		} catch(NoSuchElementException e) {
			return null;
		} catch(Exception e) {
			return null;
		}
	}
}
