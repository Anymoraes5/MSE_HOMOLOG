CREATE TABLE IF NOT EXISTS `medidas_mse` (
  `ID` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(255) NOT NULL,
  `ativo_inativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
);

INSERT IGNORE INTO `medidas_mse` (`ID`, `descricao`, `ativo_inativo`) VALUES
	(1, 'LA', 1),
	(2, 'LA/PSC', 1),
	(3, 'PSC', 1);