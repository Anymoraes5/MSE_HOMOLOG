CREATE TABLE IF NOT EXISTS `servico_familia` (
  `ID` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(100) NOT NULL,
  `ativo_inativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
);

INSERT IGNORE INTO `servico_familia` (`ID`, `descricao`, `ativo_inativo`) VALUES
(1, 'CCA', 1),
(2, 'CCInter', 1),
(3, 'CJ', 1),
(4, 'CEDESP', 1),
(5, 'Circo Social', 1),
(6, 'SPVV', 1),
(7, 'NAISPD', 1),
(8, 'SASF', 1),
(9, 'CREAS', 1),