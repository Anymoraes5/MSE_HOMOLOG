CREATE TABLE IF NOT EXISTS `raca` (
  `ID` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(50) NOT NULL,
  `ativo_inativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
);

INSERT IGNORE INTO `raca` (`ID`, `descricao`, `ativo_inativo`) VALUES
	(1, 'Branca', 1),
	(2, 'Preta', 1),
	(3, 'Parda', 1),
	(4, 'Amarela', 1),
	(5, 'Indígina', 1),
	(6, 'Não declarada', 1)