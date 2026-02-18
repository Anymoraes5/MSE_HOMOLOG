CREATE TABLE IF NOT EXISTS `nacionalidade` (
  `ID` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(50) NOT NULL,
  `ativo_inativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
);

INSERT IGNORE INTO `nacionalidade` (`ID`, `descricao`, `ativo_inativo`) VALUES
	(1, 'BRASILEIRO NATO', 1),
	(2, 'BRAS. NATURALIZADO', 1),
	(3, 'ESTRANGEIRO', 1);