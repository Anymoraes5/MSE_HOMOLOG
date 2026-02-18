CREATE TABLE IF NOT EXISTS `paroudeEstudar` (
  `ID` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(50) NOT NULL,
  `ativo_inativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
);

INSERT IGNORE INTO `paroudeEstudar` (`ID`, `descricao`, `ativo_inativo`) VALUES
	(1, '6 meses', 1),
	(2, '1 ano', 1),
	(3, '2 anos ou mais', 1);