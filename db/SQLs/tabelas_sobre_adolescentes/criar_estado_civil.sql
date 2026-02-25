CREATE TABLE IF NOT EXISTS `estado_civil` (
  `ID` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(50) NOT NULL,
  `ativo_inativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
);

INSERT IGNORE INTO `estado_civil` (`ID`, `descricao`, `ativo_inativo`) VALUES
	(1, 'Casado', 1),
	(2, 'Solteiro', 1),
	(3, 'Separado', 1),
	(4, 'Divorciado', 1),
	(5, 'Viúvo', 1),
	(6, 'União Estável', 1),
	(7, 'Convive com um(a) parceiro(a)', 1),
	(8, 'Não informado', 1);