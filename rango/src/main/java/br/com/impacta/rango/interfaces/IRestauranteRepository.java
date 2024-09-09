package br.com.impacta.rango.interfaces;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.impacta.rango.entities.Restaurante;


public interface IRestauranteRepository extends JpaRepository<Restaurante, Long> {
	   @Query(value = "SELECT r FROM Restaurante r " +
               "WHERE (6371 * acos(cos(radians(:latitude)) * cos(radians(r.endereco.latitude)) * " +
               "cos(radians(r.endereco.longitude) - radians(:longitude)) + sin(radians(:latitude)) * " +
               "sin(radians(r.endereco.latitude)))) < :raio")
	   List<Restaurante> buscaEnderecosProximos(@Param("latitude") double latitude,
                                        @Param("longitude") double longitude,
                                        @Param("raio") double raio);
}
