package br.com.impacta.rango.dto.restaurantes;

import br.com.impacta.rango.entities.CategoriaRestaurante;

public record RestauranteRegisterDTO(String nomeRes,String cnpj,String descrRes,CategoriaRestaurante categoria,Double precoMinimo,String img,String banner) {

}
