package br.com.impacta.rango.dto.enderecos;

public record EnderecoRegisterDTO(String logradouro, int numero,String bairro,String cidade, String estado,boolean selecionado,Long idUsuario,boolean casa,boolean trabalho,Double latitude,Double longitude,String complemento,String pontoReferencia) {

}
