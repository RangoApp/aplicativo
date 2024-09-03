package br.com.impacta.rango.dto;

import java.util.List;

import br.com.impacta.rango.entities.Endereco;

public record UserResponseDTO(String nomeCompleto,String email, String telefone, String cpf, List<EnderecoResponseDTO> enderecos) {

}
