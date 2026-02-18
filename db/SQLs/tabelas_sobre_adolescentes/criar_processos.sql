CREATE TABLE IF NOT EXISTS `processos` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `n_processo` VARCHAR(25) NOT NULL,
  `n_processo_apuracao` VARCHAR(25) NOT NULL,
  `n_pt` VARCHAR(25) DEFAULT NULL,
  `fk_vara_da_infancia` tinyint unsigned DEFAULT NULL,
  `dt_interpretacao_medida` date NOT NULL,
  `dt_ultimo_relatorio_enviado` date NOT NULL,
  `resumo_do_caso` varchar(2000) NOT NULL,
  `fk_situacao` tinyint unsigned NOT NULL,
  PRIMARY KEY (`ID`),
  -- UNIQUE KEY `n_processo` (`n_processo`),
  KEY `fk_vara_da_infancia` (`fk_vara_da_infancia`),
  KEY `fk_situacao` (`fk_situacao`),
  CONSTRAINT `processos_ibfk_1` FOREIGN KEY (`fk_vara_da_infancia`) REFERENCES `vara_da_infancia` (`ID`),
  CONSTRAINT `processos_ibfk_3` FOREIGN KEY (`fk_situacao`) REFERENCES `situacao_do_processo` (`ID`)
);
