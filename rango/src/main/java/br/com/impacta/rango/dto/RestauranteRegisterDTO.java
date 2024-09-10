package br.com.impacta.rango.dto;

import br.com.impacta.rango.entities.CategoriaRestaurante;

public record RestauranteRegisterDTO(String nomeRes,String cnpj,String descrRes,CategoriaRestaurante categoria,Double precoMinimo) {

}
