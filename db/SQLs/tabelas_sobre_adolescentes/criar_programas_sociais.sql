CREATE TABLE IF NOT EXISTS `programas_sociais` (
  `ID` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(100) NOT NULL,
  `ativo_inativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
);

INSERT IGNORE INTO `programas_sociais` (`ID`, `descricao`, `ativo_inativo`) VALUES
	(1, 'RENDA MÍNIMA', 1),
	(2, 'BOLSA TRABALHO', 1),
	(3, 'COMEÇAR DE NOVO - PROGRAMA CNJ - JUSTIÇA', 1),
	(4, 'PROGRAMA OPERAÇÃO TRABALHO', 1),
	(5, 'BOLSA FAMÍLIA', 1),
	(6, 'PRIMEIRO EMPREGO', 1),
	(7, 'BPC PESSOA COM DEFICIÊNCIA', 1),
	(8, 'BPC TRABALHO', 1),
	(9, 'TRABALHO NOVO', 1),
	(10, 'PROGRAMA TRANSCIDADANIA', 1),
	(11, 'PROGRAMA TEM SAÍDA - PORTARIA SMTE 25/2018', 1),
	(12, 'PROGRAMA JOVEM APRENDIZ', 1),
	(13, 'AUXÍLIO REENCONTRO', 1),
	(14, 'AUXÍLIO REENCONTRO FAMÍLIA', 1);