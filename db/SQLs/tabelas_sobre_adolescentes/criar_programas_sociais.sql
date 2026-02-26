CREATE TABLE IF NOT EXISTS `programas_sociais` (
  `ID` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(100) NOT NULL,
  `ativo_inativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
);

INSERT IGNORE INTO `programas_sociais` (`ID`, `descricao`, `ativo_inativo`) VALUES
	(1, 'Renda mínima', 1),
	(2, 'Bolsa trabalho', 1),
	(3, 'Começar de novo - Programa CNJ - Justiça', 1),
	(4, 'Programa operação trabalho', 1),
	(5, 'Bolsa família', 1),
	(6, 'Primeiro emprego', 1),
	(7, 'BPC Pessoa com deficiência', 1),
	(8, 'BPC Trabalho', 1),
	(9, 'Trabalho novo', 1),
	(10, 'Programa transcidadania', 1),
	(11, 'Programa tem sáida - PORTARIA SMTE 25/2018', 1),
	(12, 'Programa Jovem Aprendiz', 1),
	(13, 'Auxílio reencontro', 1),
	(14, 'Auxílio reencontro família', 1);