CREATE TABLE IF NOT EXISTS `raca` (
  `ID` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(50) NOT NULL,
  `ativo_inativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
);

INSERT IGNORE INTO `raca` (`ID`, `descricao`, `ativo_inativo`) VALUES
	(1, 'BRANCA', 1),
	(2, 'PRETA', 1),
	(3, 'PARDA', 1),
	(4, 'AMARELA', 1),
	(5, 'INDÍGENA', 1),
	(6, 'NÃO DECLARADA', 1)