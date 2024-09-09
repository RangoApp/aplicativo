package br.com.impacta.rango.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="enderecos")
@JsonIgnoreProperties({"restaurante"})
public class Endereco {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long idEndereco;
	@Column
	private String logradouro;
	@Column(length = 100)
	private String bairro;
	@Column(length = 55)
	private String cidade;
	@Column(length = 2)
	private String estado;
	@Column
	private String complemento;
	@Column
	private int numero;
	@Column(length = 8)
	private String cep;
	@Column
	private String pontoReferencia;
	@Column
	private boolean semNumero;
	@Column
	private boolean semComplemento;
	@Column
	private boolean selecionado;
	@Column
	private boolean casa;
	@Column
	private boolean trabalho;
    private Double latitude;
    private Double longitude;

	@ManyToOne
    @JoinColumn(name = "idUsuario", nullable=true)
    private Usuario usuario;
	
	@OneToOne
    @JoinColumn(name = "idRestaurante", nullable=true)
    private Restaurante restaurante;

	public Long getIdEndereco() {
		return idEndereco;
	}

	public void setIdEndereco(Long idEndereco) {
		this.idEndereco = idEndereco;
	}

	public String getLogradouro() {
		return logradouro;
	}

	public void setLogradouro(String logradouro) {
		this.logradouro = logradouro;
	}

	public String getBairro() {
		return bairro;
	}

	public void setBairro(String bairro) {
		this.bairro = bairro;
	}

	public String getCidade() {
		return cidade;
	}

	public void setCidade(String cidade) {
		this.cidade = cidade;
	}
	
	

	public boolean isSelecionado() {
		return selecionado;
	}

	public void setSelecionado(boolean selecionado) {
		this.selecionado = selecionado;
	}

	public String getComplemento() {
		return complemento;
	}

	public void setComplemento(String complemento) {
		this.complemento = complemento;
	}

	public int getNumero() {
		return numero;
	}

	public void setNumero(int numero) {
		this.numero = numero;
	}

	public String getCep() {
		return cep;
	}

	public void setCep(String cep) {
		this.cep = cep;
	}

	public String getPontoReferencia() {
		return pontoReferencia;
	}

	public void setPontoReferencia(String pontoReferencia) {
		this.pontoReferencia = pontoReferencia;
	}

	public boolean isSemNumero() {
		return semNumero;
	}

	public void setSemNumero(boolean semNumero) {
		this.semNumero = semNumero;
	}

	public boolean isSemComplemento() {
		return semComplemento;
	}

	public void setSemComplemento(boolean semComplemento) {
		this.semComplemento = semComplemento;
	}

	public String getEstado() {
		return estado;
	}

	public void setEstado(String estado) {
		this.estado = estado;
	}

	public Usuario getUsuario() {
		return usuario;
	}

	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}

	public boolean isCasa() {
		return casa;
	}

	public void setCasa(boolean casa) {
		this.casa = casa;
	}

	public boolean isTrabalho() {
		return trabalho;
	}

	public void setTrabalho(boolean trabalho) {
		this.trabalho = trabalho;
	}

	public Restaurante getRestaurante() {
		return restaurante;
	}

	public void setRestaurante(Restaurante restaurante) {
		this.restaurante = restaurante;
	}

	public Double getLatitude() {
		return latitude;
	}

	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}

	public Double getLongitude() {
		return longitude;
	}

	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}
	
	
	
}
