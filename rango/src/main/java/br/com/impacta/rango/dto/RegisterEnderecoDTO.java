package br.com.impacta.rango.dto;

public record RegisterEnderecoDTO(String logradouro, int numero,String bairro,String cidade, String estado,boolean selecionado,Long idUsuario,boolean casa,boolean trabalho,Double latitude,Double longitude) {

}
