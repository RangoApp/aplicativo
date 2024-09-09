package br.com.impacta.rango.entities;

import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="email_otp")
public class EmailOTP {

	@Id
	@Column(length=64)
	private String email;
	@Column(length=6)
	private String code;
	private Timestamp dtExpiration;
	
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public Timestamp getDtExpiration() {
		return dtExpiration;
	}
	public void setDtExpiration(Timestamp dtExpiration) {
		this.dtExpiration = dtExpiration;
	}
	
	
	
}
