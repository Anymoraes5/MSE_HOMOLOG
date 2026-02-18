CREATE TABLE IF NOT EXISTS `cicloEstudo` (
  `ID` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(50) NOT NULL,
  `ativo_inativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
);

INSERT IGNORE INTO `cicloEstudo` (`ID`, `descricao`, `ativo_inativo`) VALUES
	(1, 'Fundamental I', 1),
	(2, 'Fundamental II', 1),
	(3, 'Ensino Médio', 1),
	(4, 'Ensino Médio Profissionalizante', 1),
	(5, 'Ensino Superior', 1);