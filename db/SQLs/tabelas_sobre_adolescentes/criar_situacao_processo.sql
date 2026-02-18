CREATE TABLE IF NOT EXISTS `situacao_do_processo` (
  `ID` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(50) NOT NULL,
  `ativo_inativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
);

INSERT INTO `situacao_do_processo` (`ID`, `descricao`, `ativo_inativo`) VALUES
	(1, 'BUSCA E APREENSÃO', 1),
	(2, 'DESCUMPRIMENTO', 1),
	(3, 'EM CUMPRIMENTO', 1),
	(4, 'EXTINTA', 1),
	(5, 'SUSPENSA', 1),
	(6, 'PÓS MEDIDA', 1);