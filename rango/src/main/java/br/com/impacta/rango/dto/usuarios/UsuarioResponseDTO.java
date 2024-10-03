package br.com.impacta.rango.dto.usuarios;

import java.util.List;

import br.com.impacta.rango.dto.enderecos.EnderecoResponseDTO;
import br.com.impacta.rango.entities.Endereco;

public record UsuarioResponseDTO(Long idUsuario,String nomeCompleto,String email, String telefone, String cpf, List<EnderecoResponseDTO> enderecos) {

}
