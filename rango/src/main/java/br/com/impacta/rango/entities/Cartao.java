package br.com.impacta.rango.entities;

import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="cartoes")
public class Cartao {
	
@Id
@GeneratedValue(strategy=GenerationType.IDENTITY)
private Long idCartao;

@Column
private String nome;
@Column
private Long numero;
@Column
private Timestamp dtVal;
@Column
private int cod;

@ManyToOne
@JoinColumn(name="idUsuario",nullable=false)
@JsonIgnore
private Usuario usuario;

public Long getIdCartao() {
	return idCartao;
}

public void setIdCartao(Long idCartao) {
	this.idCartao = idCartao;
}

public String getNome() {
	return nome;
}

public void setNome(String nome) {
	this.nome = nome;
}

public Long getNumero() {
	return numero;
}

public void setNumero(Long numero) {
	this.numero = numero;
}

public Timestamp getDtVal() {
	return dtVal;
}

public void setDtVal(Timestamp dtVal) {
	this.dtVal = dtVal;
}

public int getCod() {
	return cod;
}

public void setCod(int cod) {
	this.cod = cod;
}

public Usuario getUsuario() {
	return usuario;
}

public void setUsuario(Usuario usuario) {
	this.usuario = usuario;
}


}
