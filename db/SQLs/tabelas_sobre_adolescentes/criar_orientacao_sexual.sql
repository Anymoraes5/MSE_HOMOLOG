CREATE TABLE IF NOT EXISTS `orientacao_sexual` (
  `ID` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(50) NOT NULL,
  `ativo_inativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
);

INSERT IGNORE INTO `orientacao_sexual` (`ID`, `descricao`, `ativo_inativo`) VALUES
	(1, 'Heterosexual', 1),
	(2, 'Homosexual', 1),
	(3, 'Bissexual', 1),
	(4, 'Assexual', 1),
	(5, 'Pansexual', 1),
	(99, 'Outros', 1);