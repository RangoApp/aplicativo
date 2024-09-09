package br.com.impacta.rango.dto;

public record RegisterEnderecoResDTO(Long idEndereco,String logradouro, int numero,String cep,String bairro,String cidade, String estado,Long idRestaurante,Double latitude,Double longitude) {

}
