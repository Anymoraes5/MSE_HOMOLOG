CREATE TABLE IF NOT EXISTS `tipo_de_contato` (
  `ID` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(100) NOT NULL,
  `ativo_inativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
);

INSERT IGNORE INTO `tipo_de_contato` (`ID`, `descricao`, `ativo_inativo`) VALUES
	(1, 'AVÓS', 1),
	(2, 'PAI', 1),
	(3, 'MÃE', 1),
	(4, 'CONJUGE', 1),
	(5, 'CUNHADO', 1),
	(6, 'IRMÃO/IRMÃ', 1),
	(7, 'PADRASTO', 1),
	(8, 'MADRASTA', 1),
	(9, 'PRIMO', 1),
	(10, 'TIO/TIA', 1),
	(11, 'SOGRO/SOGRA', 1),
	(12, 'MSE', 1),
	(13, 'OUTROS', 1);