CREATE TABLE IF NOT EXISTS `perfil` (
  `ID` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(50) NOT NULL,
  `ativo_inativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
);

INSERT IGNORE INTO `perfil` (`ID`, `descricao`, `ativo_inativo`) VALUES
	(1, 'Administrador', 1),
	(2, 'Técnico', 1);