CREATE TABLE IF NOT EXISTS `deficiencia` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(55) NOT NULL,
  `ativo_inativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
);

INSERT IGNORE INTO `deficiencia` (`descricao`, `ativo_inativo`) VALUES
	('AUDITIVA', 1),
	('FÍSICA', 1),
	('INTELECTUAL', 1),
	('MÚLTIPLA', 1),
	('OUTRA', 1),
	('PSICOSSOCIAL/MENTAL', 1),
	('VISUAL', 1);