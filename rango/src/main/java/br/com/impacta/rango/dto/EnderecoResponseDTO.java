package br.com.impacta.rango.dto;

public record EnderecoResponseDTO(String logradouro,int numero,String bairro,String cidade,String estado,boolean selecionado,boolean casa,boolean trabalho,Double latitude,Double longitude) {
	
}
