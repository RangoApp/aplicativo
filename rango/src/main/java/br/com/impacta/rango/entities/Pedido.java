package br.com.impacta.rango.entities;

import java.sql.Timestamp;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name="pedidos")
public class Pedido {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long idPedido;
	
	@ManyToOne
    @JoinColumn(name="idRestaurante",nullable=false)
	private Restaurante restaurante;
	
	@Column
	private double frete;
	
	@Column
	private Timestamp dtNeg;
	
	@Column
	private Timestamp tempo;
	
	@Column
	private Timestamp tempoLimite;
	
	@Column
	private String codigo;
	
	@Column
	private int status;
	
	@OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
	private List<ItemPedido> itens;

	public Long getIdPedido() {
		return idPedido;
	}

	public void setIdPedido(Long idPedido) {
		this.idPedido = idPedido;
	}

	public double getFrete() {
		return frete;
	}

	public void setFrete(double frete) {
		this.frete = frete;
	}

	public Timestamp getDtNeg() {
		return dtNeg;
	}

	public void setDtNeg(Timestamp dtNeg) {
		this.dtNeg = dtNeg;
	}

	public List<ItemPedido> getItens() {
		return itens;
	}

	public void setItens(List<ItemPedido> itens) {
		this.itens = itens;
	}

	public Restaurante getRestaurante() {
		return restaurante;
	}

	public void setRestaurante(Restaurante restaurante) {
		this.restaurante = restaurante;
	}
	
	public Timestamp getTempo() {
		return tempo;
	}
	public void setTempo(Timestamp tempo) {
		this.tempo = tempo;
	}
	public Timestamp getTempoLimite() {
		return tempoLimite;
	}
	public void setTempoLimite(Timestamp tempoLimite) {
		this.tempoLimite = tempoLimite;
	}

	public String getCodigo() {
		return codigo;
	}

	public void setCodigo(String codigo) {
		this.codigo = codigo;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}
	
	
	
}
