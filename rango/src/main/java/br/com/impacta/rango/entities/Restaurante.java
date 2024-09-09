package br.com.impacta.rango.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="restaurantes")
public class Restaurante {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long idRestaurante;
	@Column(length=64)
	private String nomeRes;
	@Column
	private String descrRes;
	@Column(unique=true,length=14)
	private String cnpj;

	@OneToOne(mappedBy = "restaurante", cascade = CascadeType.ALL)
	private Endereco endereco;

	public Long getIdRestaurante() {
		return idRestaurante;
	}

	public void setIdRestaurante(Long idRestaurante) {
		this.idRestaurante = idRestaurante;
	}

	public String getNomeRes() {
		return nomeRes;
	}

	public void setNomeRes(String nomeRes) {
		this.nomeRes = nomeRes;
	}

	public String getDescrRes() {
		return descrRes;
	}

	public void setDescrRes(String descrRes) {
		this.descrRes = descrRes;
	}

	public String getCnpj() {
		return cnpj;
	}

	public void setCnpj(String cnpj) {
		this.cnpj = cnpj;
	}

	public Endereco getEndereco() {
		return endereco;
	}

	public void setEndereco(Endereco endereco) {
		this.endereco = endereco;
	}
	
	

}
