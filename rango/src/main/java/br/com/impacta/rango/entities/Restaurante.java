package br.com.impacta.rango.entities;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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
	@Column
	private CategoriaRestaurante categoria;
	@Column
	private String img;
	@Column 
	private String banner;
	@Column
	private Double precoMinimo;

	@OneToOne(mappedBy = "restaurante", cascade = CascadeType.ALL)
	private Endereco endereco;
	
	@OneToMany(mappedBy = "restaurante", cascade = CascadeType.ALL)
	private List<Produto> produtos;


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

	public CategoriaRestaurante getCategoria() {
		return categoria;
	}

	public void setCategoria(CategoriaRestaurante categoria) {
		this.categoria = categoria;
	}

	public Double getPrecoMinimo() {
		return precoMinimo;
	}

	public void setPrecoMinimo(Double precoMinimo) {
		this.precoMinimo = precoMinimo;
	}

	public String getImg() {
		return img;
	}

	public void setImg(String img) {
		this.img = img;
	}

	public List<Produto> getProdutos() {
		return produtos;
	}

	public void setProdutos(List<Produto> produtos) {
		this.produtos = produtos;
	}

	public String getBanner() {
		return banner;
	}

	public void setBanner(String banner) {
		this.banner = banner;
	}
	

}
