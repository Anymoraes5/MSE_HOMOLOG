CREATE TABLE IF NOT EXISTS `contatos_pessoas` (
  `fk_id_pessoas` int unsigned NOT NULL,
  `fk_id_contatos` tinyint unsigned NOT NULL,
  `fk_tipo_de_contato` tinyint unsigned NOT NULL,
  PRIMARY KEY (`fk_id_pessoas`,`fk_id_contatos`),
  KEY `fk_id_contatos` (`fk_id_contatos`),
  KEY `fk_tipo_de_contato` (`fk_tipo_de_contato`),
  CONSTRAINT `contatos_pessoas_ibfk_1` FOREIGN KEY (`fk_id_pessoas`) REFERENCES `pessoas` (`ID`),
  CONSTRAINT `contatos_pessoas_ibfk_2` FOREIGN KEY (`fk_id_contatos`) REFERENCES `contatos` (`ID`),
  CONSTRAINT `contatos_pessoas_ibfk_3` FOREIGN KEY (`fk_tipo_de_contato`) REFERENCES `tipo_de_contato` (`ID`)
);