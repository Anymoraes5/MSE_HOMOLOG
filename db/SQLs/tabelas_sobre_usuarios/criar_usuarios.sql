CREATE TABLE IF NOT EXISTS `usuarios` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `cpf` varchar(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `login` varchar(50) NOT NULL,
  `senha` varchar(50) NOT NULL,
  `ativo_inativo` tinyint(1) NOT NULL,
  `dt_nasc` date NOT NULL,
  `fk_tipo_perfil` tinyint unsigned NOT NULL,
  `fk_mse` tinyint unsigned NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `cpf` (`cpf`),
  UNIQUE KEY `unique_login` (`login`),
  KEY `fk_tipo_perfil` (`fk_tipo_perfil`),
  KEY `fk_mse` (`fk_mse`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`fk_tipo_perfil`) REFERENCES `perfil` (`ID`),
  CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`fk_mse`) REFERENCES `mse` (`ID`)
);

INSERT IGNORE INTO `usuarios` (`ID`, `cpf`, `nome`, `login`, `senha`, `ativo_inativo`, `dt_nasc`, `fk_tipo_perfil`, `fk_mse`) VALUES
	(1, '75870182042', 'ADMIN', 'admin@email.com', 'admin123', 1, '2000-01-01', 1, 2);