CREATE TABLE IF NOT EXISTS `programas_sociais_pessoas` (
  `fk_id_pessoa` INT unsigned NOT NULL,
  `fk_programa_social_id` tinyint unsigned NOT NULL,
  PRIMARY KEY (`fk_id_pessoa`, `fk_programa_social_id`),
   KEY `fk_id_pessoa` (`fk_id_pessoa`),
   KEY `fk_programa_social_id` (`fk_programa_social_id`),
  CONSTRAINT `fk_id_pessoa_constraint` FOREIGN KEY (`fk_id_pessoa`) REFERENCES `pessoas` (`ID`),
  CONSTRAINT `fk_programa_social_id_constraint` FOREIGN KEY (`fk_programa_social_id`) REFERENCES `programas_sociais` (`ID`)
);