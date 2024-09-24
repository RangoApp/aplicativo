package br.com.impacta.rango.repositories;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.impacta.rango.config.EmailConfig;
import br.com.impacta.rango.entities.EmailOTP;
import br.com.impacta.rango.interfaces.IEmailOTPRepository;

@Service
public class EmailOTPRepository {
	@Autowired
	private IEmailOTPRepository repo;
	@Autowired
	private EmailConfig emailConfig;
	
	public void sendCodeToEmail(String email) {
		try {
			EmailOTP existEmailOTP = repo.findById(email).orElseThrow();
			repo.deleteById(email);
		} catch (NoSuchElementException e) {
			
		}
		
		String code = generateRandomCode();
		EmailOTP emailOTP = new EmailOTP();
		emailOTP.setCode(code);
		emailOTP.setEmail(email);
		
        Instant currentTimestamp = Instant.now();

        // Adiciona 1 hora ao timestamp atual
        Instant dtExpiration = currentTimestamp.plusSeconds(3600);
		emailOTP.setDtExpiration(Timestamp.from(dtExpiration));
		
		emailConfig.sendEmail("Rango", "lucasyudi7@gmail.com", email, "Rango - Verificar Conta", code);
		repo.save(emailOTP);
	}
	
	public Optional<EmailOTP> findUserByEmailAndCode(String email, String code) {
        return repo.findByEmailAndCode(email, code);
    }
	
	public boolean verifyCode(String email,String code) {
		try {
			
			EmailOTP emailOTP = findUserByEmailAndCode(email,code).orElseThrow();
			
			Timestamp currentTimestamp = Timestamp.from(Instant.now());
			
			if(emailOTP.getDtExpiration().before(currentTimestamp)) {
				return false;
			}
			return true;
		} catch (NoSuchElementException e) {
			return false;
		}
	}
	
	private String generateRandomCode() {
		 // Cria um objeto Random
       Random random = new Random();

       // Gera um número aleatório de 0 a 999999 (6 dígitos)
       int randomNumber = random.nextInt(999999);

       // Formata o número para sempre ter 6 dígitos
       String formattedNumber = String.format("%06d", randomNumber);
       return formattedNumber;
	}

}
