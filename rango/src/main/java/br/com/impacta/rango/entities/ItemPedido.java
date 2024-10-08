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
@Table(name="itens_pedido")
public class ItemPedido {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long idItemPedido;
	
	@ManyToOne
    @JoinColumn(name="idProduto",nullable=false)
	private Produto produto;
	
	@ManyToOne
    @JoinColumn(name="idPedido",nullable=false)
    @JsonIgnore
	private Pedido pedido;
	
	@Column
	private int qtd;
	
	
	public Long getIdItemPedido() {
		return idItemPedido;
	}
	public void setIdItemPedido(Long idItemPedido) {
		this.idItemPedido = idItemPedido;
	}
	public Produto getProduto() {
		return produto;
	}
	public void setProduto(Produto produto) {
		this.produto = produto;
	}
	public int getQtd() {
		return qtd;
	}
	public void setQtd(int qtd) {
		this.qtd = qtd;
	}
	public Pedido getPedido() {
		return pedido;
	}
	public void setPedido(Pedido pedido) {
		this.pedido = pedido;
	}

	
	
	
}
