package br.com.impacta.rango.interfaces;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


import br.com.impacta.rango.entities.EmailOTP;


public interface IEmailOTPRepository extends JpaRepository<EmailOTP, String> {

	// Método para encontrar um usuário por email e código
    Optional<EmailOTP> findByEmailAndCode(String email, String code);
}
