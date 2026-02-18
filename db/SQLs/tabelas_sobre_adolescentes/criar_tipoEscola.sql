CREATE TABLE IF NOT EXISTS `tipoEscola` (
  `ID` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(50) NOT NULL,
  `ativo_inativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
);

INSERT IGNORE INTO `tipoEscola` (`ID`, `descricao`, `ativo_inativo`) VALUES
	(1, 'Escola Estadual', 1),
	(2, 'Escola Municipal', 1),
	(3, 'Escola Particular', 1),
	(4, 'Outro', 1);