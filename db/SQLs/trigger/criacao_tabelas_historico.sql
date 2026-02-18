CREATE TABLE IF NOT EXISTS `historico_contatos` (
	`ID` INT unsigned NOT NULL,
	`telefone` varchar(11) DEFAULT NULL,
	`nome` varchar(100) DEFAULT NULL,
	`email` varchar(100) DEFAULT NULL,
	dt_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	-- PRIMARY KEY (`ID`)
);


CREATE TABLE IF NOT EXISTS `historico_contatos_pessoas` (
	`fk_id_pessoas` int unsigned NOT NULL,
	`fk_id_contatos` int unsigned NOT NULL,
	`fk_tipo_de_contato` tinyint unsigned NOT NULL,
	 dt_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	-- PRIMARY KEY (`fk_id_pessoas`,`fk_id_contatos`)
);


CREATE TABLE IF NOT EXISTS `historico_pessoas` (
  `ID` int unsigned NOT NULL,
  `fk_creas_atual` tinyint unsigned NOT NULL,
  `fk_mse` tinyint unsigned NOT NULL,
  `fk_tec_ref` int  NOT NULL,
  `fk_ubs` smallint unsigned,
  `fk_sas` tinyint unsigned NOT NULL,
  `fk_servico_familia` tinyint unsigned DEFAULT NULL,
  `fk_distrito_servico` tinyint unsigned NOT NULL,
  `fk_medidas` tinyint unsigned NOT NULL,
  `fk_creas_origem` tinyint unsigned DEFAULT NULL,
  `nome` varchar(100) NOT NULL,
  `nome_social` varchar(100) DEFAULT NULL,
  `dt_nasc` date NOT NULL,
  `cpf` varchar(11) DEFAULT NULL,
  `nis` varchar(11) DEFAULT NULL,
  `cartao_sus` varchar(18) DEFAULT NULL,
  `nome_da_mae` varchar(100) NOT NULL,
  `nome_do_pai` varchar(100) DEFAULT NULL,
  `nome_responsavel` varchar(100) DEFAULT NULL,
  `sexo` char(1) NOT NULL,
  `fk_raca` tinyint unsigned NOT NULL,
  `fk_nacionalidade` tinyint unsigned NOT NULL,
  -- `indicacao_sigilo` tinyint(1) NOT NULL,
  `fk_genero` tinyint unsigned DEFAULT NULL,
  `fk_orientacao_sexual` tinyint unsigned DEFAULT NULL,
  `fk_estado_civil` tinyint unsigned NOT NULL,
  `matriculado` tinyint(1) NOT NULL,
  `alfabetizado` tinyint(1) NOT NULL,
  `fk_cicloEstudo` tinyint unsigned DEFAULT NULL,
  `numeroRa` varchar(11) DEFAULT NULL,
  `fk_tipoEscola` tinyint unsigned DEFAULT NULL,
  `fk_ensinoModalidade` tinyint unsigned DEFAULT NULL,
  `frequenciaAula` tinyint(1) DEFAULT NULL,
  `concluiuCurso` tinyint(1) DEFAULT NULL,
  `fk_paroudeEstudar` tinyint unsigned DEFAULT NULL,
  `possui_deficiencia` tinyint(1) NOT NULL,
  `fk_deficiencia` int unsigned DEFAULT NULL,
  `fk_trabalho` tinyint unsigned DEFAULT NULL,
  `necessita_cuidados_terceiros` tinyint(1) NOT NULL,
  `possui_demanda_saude` tinyint(1) NOT NULL,
  `saude` varchar(100) DEFAULT NULL,
  `possui_demanda_saude_mental` tinyint(1) NOT NULL,
  `saude_mental` varchar(100) DEFAULT NULL,
  `acompanhamento_saude` tinyint(1) DEFAULT NULL,
  `faz_uso_de_medicamentos` tinyint(1) NOT NULL,
  `medicamentos` varchar(100) DEFAULT NULL,
  `faz_uso_de_medicamentos_controlados` tinyint(1) NOT NULL,
  `medicamentos_controlados` varchar(100) DEFAULT NULL,
  `possui_trabalho` tinyint(1) DEFAULT NULL,
  `possui_familia_em_servico` tinyint(1) NOT NULL,
  `gestante` tinyint(1) DEFAULT NULL,
  `parceira_gestante` tinyint(1) DEFAULT NULL,
  `lactante` tinyint(1) DEFAULT NULL,
  `possui_filhos` tinyint(1) NOT NULL,
  `responsavel_por_pcd` tinyint(1) NOT NULL,
  `adolescente_com_trajetoria_de_acolhimento` tinyint(1) NOT NULL,
  `fk_alcool_ou_drogas` tinyint unsigned NOT NULL,
  `caps` tinyint(1) DEFAULT NULL,
  `curso` tinyint(1) NOT NULL,
  `fk_processos` int unsigned NOT NULL,
  `fk_distrito_pessoa` tinyint unsigned NOT NULL,
  `cep` varchar(8) NOT NULL,
  `bairro` varchar(100) NOT NULL,
  `rua` varchar(100) NOT NULL,
  `numero` int unsigned NOT NULL,
  `complemento` varchar(255) DEFAULT NULL,
  `dt_cadastro` date NOT NULL,
  `dt_atualizacao` date NOT NULL,
  `dt_desligamento` date DEFAULT NULL,
  `ativo_inativo` tinyint(1) NOT NULL,
  `listar_cursos` varchar(2000) DEFAULT NULL
  -- PRIMARY KEY (`ID`)
);


CREATE TABLE IF NOT EXISTS `historico_processos` (
	`ID` int unsigned NOT NULL,
	`n_processo` VARCHAR(25) NOT NULL,
	`n_processo_apuracao` VARCHAR(25) NOT NULL,
	`n_pt` VARCHAR(25) DEFAULT NULL,
	`fk_vara_da_infancia` tinyint unsigned DEFAULT NULL,
	`dt_interpretacao_medida` date NOT NULL,
	`dt_ultimo_relatorio_enviado` date NOT NULL,
	`resumo_do_caso` varchar(2000) NOT NULL,
	`fk_situacao` tinyint unsigned NOT NULL,
	dt_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	-- PRIMARY KEY (`ID`)
	-- UNIQUE KEY `n_processo` (`n_processo`),
);


CREATE TABLE IF NOT EXISTS `historico_programas_sociais_pessoas` (
 -- `ID` tinyint unsigned NOT NULL AUTO_INCREMENT,
	`fk_id_pessoa` INT unsigned NOT NULL,
	`fk_programa_social_id` tinyint unsigned NOT NULL,
  	dt_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	-- PRIMARY KEY (`fk_id_pessoa`, `fk_programa_social_id`)
);


CREATE TABLE IF NOT EXISTS `historico_usuarios` (
	`ID` int NOT NULL,
	`cpf` varchar(11) NOT NULL,
	`nome` varchar(100) NOT NULL,
	`login` varchar(50) NOT NULL,
	`senha` varchar(50) NOT NULL,
	`ativo_inativo` tinyint(1) NOT NULL,
	`dt_nasc` date NOT NULL,
	`fk_tipo_perfil` tinyint unsigned NOT NULL,
	`fk_mse` tinyint unsigned NOT NULL,
	dt_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	-- PRIMARY KEY (`ID`)
);
