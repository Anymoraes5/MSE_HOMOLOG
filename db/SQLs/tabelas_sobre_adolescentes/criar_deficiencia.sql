CREATE TABLE IF NOT EXISTS `deficiencia` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(55) NOT NULL,
  `ativo_inativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
);

INSERT IGNORE INTO `deficiencia` (`descricao`, `ativo_inativo`) VALUES
	('Auditiva', 1),
	('Física', 1),
	('Intelectual', 1),
	('Multípla', 1),
	('Outra', 1),
	('Psicossocial/Mental', 1),
	('Visual', 1);