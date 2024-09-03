package br.com.impacta.rango.interfaces;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.impacta.rango.dto.RegisterEnderecoDTO;
import br.com.impacta.rango.entities.Endereco;
import br.com.impacta.rango.entities.Usuario;

@Service
public class EnderecoRepository {
	@Autowired
	private IEnderecoRepository repo;
	
	@Autowired
	private IUserRepository userRepo;
	
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

		newEndereco.setUsuario(usuario);
		repo.save(newEndereco);
		
		return true;
	}
	
	public void atualizarEndereco(Long idSelecionado) {
        // Primeiro, desmarque todos os endereços
        repo.desmarcarTodosExceto(idSelecionado);

        // Em seguida, marque o endereço selecionado
        repo.marcarComoSelecionado(idSelecionado);
    }
}
