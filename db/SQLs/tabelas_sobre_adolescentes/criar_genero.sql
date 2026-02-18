CREATE TABLE IF NOT EXISTS `genero` (
  `ID` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(50) NOT NULL,
  `ativo_inativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
);

INSERT IGNORE INTO `genero` (`ID`, `descricao`, `ativo_inativo`) VALUES
	(1, 'TRAVESTI', 1),
	(2, 'MULHER TRANSEXUAL', 1),
	(3, 'INTERSEXUAL', 1),
	(4, 'TRANSGÊNERO', 1),
	(5, 'CISGÊNERO', 1),
	(6, 'HOMEM TRANSEXUAL', 1),
	(7, 'OUTRAS IDENTIDADES DE GÊNERO', 1);