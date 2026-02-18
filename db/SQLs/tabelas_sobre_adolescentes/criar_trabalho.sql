CREATE TABLE IF NOT EXISTS `trabalho` (
  `ID` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(50) NOT NULL,
  `ativo_inativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
);

INSERT IGNORE INTO `trabalho` (`ID`, `descricao`, `ativo_inativo`) VALUES
	(1, 'CLT', 1),
	(2, 'ESTÁGIO', 1),
	(3, 'INFORMAL', 1),
	(4, 'JOVEM APRENDIZ', 1);