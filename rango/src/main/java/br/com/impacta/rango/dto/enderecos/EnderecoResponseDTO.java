package br.com.impacta.rango.dto.enderecos;

public record EnderecoResponseDTO(Long idEndereco,String logradouro,int numero,String bairro,String cidade,String estado,boolean selecionado,boolean casa,boolean trabalho,Double latitude,Double longitude,String complemento,String pontoReferencia) {
	
}
