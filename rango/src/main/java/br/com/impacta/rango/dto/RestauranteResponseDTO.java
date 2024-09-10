package br.com.impacta.rango.dto;

import br.com.impacta.rango.entities.CategoriaRestaurante;

public record RestauranteResponseDTO(Long idRestaurante, String nomeRes,String descrRes,String cnpj,CategoriaRestaurante categoria,Double precoMinimo) {

}
