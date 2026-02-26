CREATE TABLE IF NOT EXISTS `genero` (
  `ID` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(50) NOT NULL,
  `ativo_inativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
);

INSERT IGNORE INTO `genero` (`ID`, `descricao`, `ativo_inativo`) VALUES
	(1, 'Travesti', 1),
	(2, 'Mulher transexual', 1),
	(3, 'Intersexual ', 1),
	(4, 'Transgênero', 1),
	(5, 'Cisgenêro', 1),
	(6, 'Homem transexual', 1),
	(7, 'Outras identidades de genêro', 1);