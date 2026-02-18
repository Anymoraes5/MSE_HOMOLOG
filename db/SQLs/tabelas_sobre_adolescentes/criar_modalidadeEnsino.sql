CREATE TABLE IF NOT EXISTS `ensinoModalidade` (
  `ID` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(100) NOT NULL,
  `ativo_inativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
);

INSERT IGNORE INTO `ensinoModalidade` (`ID`, `descricao`, `ativo_inativo`) VALUES
	(1, 'ENSINO REGULAR', 1),
	(2, 'EJA - EDUCAÇÃO DE JOVENS E ADULTOS', 1),
  (3, 'CIEJA - CENTRO INTEGRADO DE EDUCAÇÃO DE JOVENS E ADULTOS', 1),
  (4, 'CEEJA - CENTRO ESTADUAL DE EDUCAÇÃO DE JOVENS E ADULTOS', 1);