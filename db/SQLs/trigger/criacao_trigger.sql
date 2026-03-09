-- Trigger para contatos
CREATE TRIGGER before_contatos_update
BEFORE UPDATE ON contatos
FOR EACH ROW
    INSERT INTO historico_contatos (email, ID, nome, telefone)
    VALUES (OLD.email, OLD.ID, OLD.nome, OLD.telefone);

-- Trigger para contatos_pessoas
CREATE TRIGGER before_contatos_pessoas_update
BEFORE UPDATE ON contatos_pessoas
FOR EACH ROW
    INSERT INTO historico_contatos_pessoas (fk_id_contatos, fk_id_pessoas, fk_tipo_de_contato)
    VALUES (OLD.fk_id_contatos, OLD.fk_id_pessoas, OLD.fk_tipo_de_contato);

-- Trigger para pessoas
CREATE TRIGGER before_pessoas_update
BEFORE UPDATE ON pessoas
FOR EACH ROW
    INSERT INTO historico_pessoas (dt_atualizacao,
        acompanhamento_saude, adolescente_com_trajetoria_de_acolhimento, alfabetizado, ativo_inativo, bairro, 
        caps, cartao_sus, cep, complemento, concluiuCurso, cpf, curso, dt_cadastro, dt_desligamento, dt_nasc, 
        faz_uso_de_medicamentos, faz_uso_de_medicamentos_controlados, fk_alcool_ou_drogas, fk_cicloEstudo, 
        fk_creas_atual, fk_creas_origem, fk_deficiencia, fk_distrito_pessoa, fk_distrito_servico, 
        fk_ensinoModalidade, fk_estado_civil, fk_genero, fk_medidas, fk_mse, fk_nacionalidade, 
        fk_orientacao_sexual, fk_paroudeEstudar, fk_processos, fk_raca, fk_sas, fk_servico_familia, 
        fk_tec_ref, fk_tipoEscola, fk_trabalho, fk_ubs, frequenciaAula, gestante, ID, lactante, listar_cursos, 
        matriculado, medicamentos, medicamentos_controlados, necessita_cuidados_terceiros,  nome, 
        nome_da_mae, nome_do_pai, nome_responsavel, nome_social, numero, numeroRa, parceira_gestante, 
        possui_deficiencia, possui_demanda_saude, possui_demanda_saude_mental, possui_familia_em_servico, 
        possui_filhos, possui_trabalho, responsavel_por_pcd, rua, saude, saude_mental, sexo
    ) VALUES (OLD.dt_atualizacao,
        OLD.acompanhamento_saude, OLD.adolescente_com_trajetoria_de_acolhimento, OLD.alfabetizado, OLD.ativo_inativo, 
        OLD.bairro, OLD.caps, OLD.cartao_sus, OLD.cep, OLD.complemento, OLD.concluiuCurso, OLD.cpf, OLD.curso, 
        OLD.dt_cadastro, OLD.dt_desligamento, OLD.dt_nasc, OLD.faz_uso_de_medicamentos, 
        OLD.faz_uso_de_medicamentos_controlados, OLD.fk_alcool_ou_drogas, OLD.fk_cicloEstudo, OLD.fk_creas_atual, 
        OLD.fk_creas_origem, OLD.fk_deficiencia, OLD.fk_distrito_pessoa, OLD.fk_distrito_servico, 
        OLD.fk_ensinoModalidade, OLD.fk_estado_civil, OLD.fk_genero, OLD.fk_medidas, OLD.fk_mse, 
        OLD.fk_nacionalidade, OLD.fk_orientacao_sexual, OLD.fk_paroudeEstudar, OLD.fk_processos, OLD.fk_raca, 
        OLD.fk_sas, OLD.fk_servico_familia, OLD.fk_tec_ref, OLD.fk_tipoEscola, OLD.fk_trabalho, OLD.fk_ubs, 
        OLD.frequenciaAula, OLD.gestante, OLD.ID, OLD.lactante, OLD.listar_cursos, OLD.matriculado, OLD.medicamentos, 
        OLD.medicamentos_controlados, OLD.necessita_cuidados_terceiros, OLD.nome, OLD.nome_da_mae, 
        OLD.nome_do_pai, OLD.nome_responsavel, OLD.nome_social, OLD.numero, OLD.numeroRa, OLD.parceira_gestante, 
        OLD.possui_deficiencia, OLD.possui_demanda_saude, OLD.possui_demanda_saude_mental, 
        OLD.possui_familia_em_servico, OLD.possui_filhos, OLD.possui_trabalho, OLD.responsavel_por_pcd, 
        OLD.rua, OLD.saude, OLD.saude_mental, OLD.sexo
    );

-- Trigger para processos
CREATE TRIGGER before_processos_update
BEFORE UPDATE ON processos
FOR EACH ROW
    INSERT INTO historico_processos (
        dt_interpretacao_medida, dt_ultimo_relatorio_enviado, fk_situacao, fk_vara_da_infancia, 
        ID, n_processo, n_processo_apuracao, n_pt, resumo_do_caso
    ) VALUES (
        OLD.dt_interpretacao_medida, OLD.dt_ultimo_relatorio_enviado, OLD.fk_situacao, OLD.fk_vara_da_infancia, 
        OLD.ID, OLD.n_processo, OLD.n_processo_apuracao, OLD.n_pt, OLD.resumo_do_caso
    );

-- Trigger para programas_sociais_pessoas
CREATE TRIGGER before_programas_sociais_pessoas_update
BEFORE UPDATE ON programas_sociais_pessoas
FOR EACH ROW
    INSERT INTO historico_programas_sociais_pessoas (fk_id_pessoa, fk_programa_social_id)
    VALUES (OLD.fk_id_pessoa, OLD.fk_programa_social_id);

-- Trigger para usuarios
CREATE TRIGGER before_usuarios_update
BEFORE UPDATE ON usuarios
FOR EACH ROW
    INSERT INTO historico_usuarios (
        ativo_inativo, cpf, dt_nasc, fk_mse, fk_tipo_perfil, ID, login, nome, senha
    ) VALUES (
        OLD.ativo_inativo, OLD.cpf, OLD.dt_nasc, OLD.fk_mse, OLD.fk_tipo_perfil, OLD.ID, OLD.login, OLD.nome, OLD.senha
    );
