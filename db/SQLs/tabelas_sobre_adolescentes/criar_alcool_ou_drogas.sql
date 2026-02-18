CREATE TABLE IF NOT EXISTS `alcool_ou_drogas` (
  `ID` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(50) NOT NULL,
  `ativo_inativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
);

INSERT IGNORE INTO `alcool_ou_drogas` (`ID`, `descricao`, `ativo_inativo`) VALUES
	(1, 'Sim, uso esporádico.', 1),
	(2, 'Sim, uso abusivo.', 1),
	(3, 'Não', 1);