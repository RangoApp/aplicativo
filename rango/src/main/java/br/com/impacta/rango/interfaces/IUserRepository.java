package br.com.impacta.rango.interfaces;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.google.common.base.Optional;

import br.com.impacta.rango.entities.EmailOTP;
import br.com.impacta.rango.entities.Usuario;

public interface IUserRepository extends JpaRepository<Usuario, Long> {
	Usuario findByEmail(String email);
}
