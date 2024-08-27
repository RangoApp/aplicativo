package br.com.impacta.rango.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailConfig {
	@Autowired private JavaMailSender sender;
	public void sendEmail(
			String owner
			,String from
			,String to
			,String title
			,String text) {
		SimpleMailMessage msg = new SimpleMailMessage();
		msg.setFrom(from);
		msg.setTo(to);
		msg.setSubject(title);
		msg.setText(text);
		
		sender.send(msg);	
	}
}

