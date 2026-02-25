CREATE TABLE IF NOT EXISTS `tipo_de_contato` (
  `ID` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(100) NOT NULL,
  `ativo_inativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
);

INSERT IGNORE INTO `tipo_de_contato` (`ID`, `descricao`, `ativo_inativo`) VALUES
	(1, 'Avós', 1),
	(2, 'Pai', 1),
	(3, 'Mãe', 1),
	(4, 'Conjuge', 1),
	(5, 'Cunhado', 1),
	(6, 'Irmão/Irmã', 1),
	(7, 'Padrastro', 1),
	(8, 'Madrastra', 1),
	(9, 'Primo', 1),
	(10, 'Tio/Tio', 1),
	(11, 'Sogro/Sogra', 1),
	(12, 'MSE', 1),
	(13, 'Outros', 1);