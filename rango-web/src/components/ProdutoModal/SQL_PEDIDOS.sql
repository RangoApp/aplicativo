CREATE TABLE `pedidos` (
  `id_pedido` bigint NOT NULL AUTO_INCREMENT,
  `dt_neg` datetime(6) DEFAULT NULL,
  `frete` double DEFAULT NULL,
  `id_restaurante` bigint NOT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `FKa5nobkskmmmses3qsp75mtfoy` (`id_restaurante`),
  CONSTRAINT `FKa5nobkskmmmses3qsp75mtfoy` FOREIGN KEY (`id_restaurante`) REFERENCES `restaurantes` (`id_restaurante`)
);
CREATE TABLE `itens_pedido` (
  `id_item_pedido` bigint NOT NULL AUTO_INCREMENT,
  `qtd` int DEFAULT NULL,
  `id_pedido` bigint NOT NULL,
  `id_produto` bigint NOT NULL,
  PRIMARY KEY (`id_item_pedido`),
  KEY `FKsf6v1y1ssvgc4o6n7htptrcay` (`id_pedido`),
  KEY `FKcic1aufppp64ge2cyqt9bp5lq` (`id_produto`),
  CONSTRAINT `FKcic1aufppp64ge2cyqt9bp5lq` FOREIGN KEY (`id_produto`) REFERENCES `produtos` (`id_produto`),
  CONSTRAINT `FKsf6v1y1ssvgc4o6n7htptrcay` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`)
);