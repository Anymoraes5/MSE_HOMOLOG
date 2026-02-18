CREATE TABLE IF NOT EXISTS `vara_da_infancia` (
  `ID` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(100) NOT NULL,
  `ativo_inativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
);

INSERT IGNORE INTO `vara_da_infancia` (`ID`, `descricao`, `ativo_inativo`) VALUES
	(1, '1ª VARA ESPECIAL DA INFÂNCIA E JUVENTUDE', 1),
	(2, '2ª VARA ESPECIAL DA INFÂNCIA E JUVENTUDE', 1),
	(3, '3ª VARA ESPECIAL DA INFÂNCIA E JUVENTUDE', 1),
	(4, '4ª VARA ESPECIAL DA INFÂNCIA E JUVENTUDE', 1),
	(5, '5ª VARA ESPECIAL DA INFÂNCIA E JUVENTUDE', 1),
	(6, '6ª VARA ESPECIAL DA INFÂNCIA E JUVENTUDE', 1),
	(7, 'DEIJ - DEPTO DE EXECUÇÕES DA VARA ESP. INF. JUV.', 1),
	(8, 'FUNDAÇÃO CASA', 1),
	(9, 'OUTRA COMARCA', 1);