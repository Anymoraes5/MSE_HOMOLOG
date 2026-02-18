CREATE TABLE IF NOT EXISTS `orientacao_sexual` (
  `ID` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(50) NOT NULL,
  `ativo_inativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
);

INSERT IGNORE INTO `orientacao_sexual` (`ID`, `descricao`, `ativo_inativo`) VALUES
	(1, 'HETEROSSEXUAL', 1),
	(2, 'HOMOSSEXUAL', 1),
	(3, 'BISSEXUAL', 1),
	(4, 'ASSEXUAL', 1),
	(5, 'PANSEXUAL', 1),
	(99, 'OUTROS', 1);