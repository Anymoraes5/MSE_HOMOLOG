CREATE TABLE IF NOT EXISTS `situacao_do_processo` (
  `ID` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(50) NOT NULL,
  `ativo_inativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
);

INSERT INTO `situacao_do_processo` (`ID`, `descricao`, `ativo_inativo`) VALUES
	(1, 'Busca e apreensão', 1),
	(2, 'Descumprimento', 1),
	(3, 'Em cumprimento', 1),
	(4, 'Extinta', 1),
	(5, 'Suspensa', 1),
	(6, 'Pós medida', 1);