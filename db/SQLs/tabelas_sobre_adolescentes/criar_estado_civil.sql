CREATE TABLE IF NOT EXISTS `estado_civil` (
  `ID` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(50) NOT NULL,
  `ativo_inativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
);

INSERT IGNORE INTO `estado_civil` (`ID`, `descricao`, `ativo_inativo`) VALUES
	(1, 'CASADO', 1),
	(2, 'SOLTEIRO', 1),
	(3, 'SEPARADO', 1),
	(4, 'DIVORCIADO', 1),
	(5, 'VIÚVO', 1),
	(6, 'UNIÃO ESTÁVEL', 1),
	(7, 'CONVIVE COM UM(A) PARCEIRO(A)', 1),
	(8, 'NÃO INFORMADO', 1);