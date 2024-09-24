package br.com.impacta.rango.dto;

import java.util.List;

import br.com.impacta.rango.entities.CategoriaRestaurante;
import br.com.impacta.rango.entities.Produto;

public record RestauranteResponseDTO(Long idRestaurante, String nomeRes,String descrRes,String cnpj,CategoriaRestaurante categoria,Double precoMinimo,List<Produto> produtos,String img,String banner) {

}
