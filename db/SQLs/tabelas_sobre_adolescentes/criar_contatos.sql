CREATE TABLE IF NOT EXISTS `contatos` (
  `ID` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `telefone` varchar(11) DEFAULT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`)
);