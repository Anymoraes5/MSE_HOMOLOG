import os
import time
from sqlalchemy import create_engine, text

db_user = os.getenv("DB_USER", "root")
db_password = os.getenv("DB_PASS", "root")
db_host = os.getenv("DB_HOST", "localhost")
db_name = os.getenv("DB_NAME", "bd_mse")

# Configuração do banco de dados
DATABASE_TYPE = 'mysql'
DBAPI = 'pymysql'
ENDPOINT = db_host
USER = db_user
PASSWORD = db_password
PORT = 3306
DATABASE = None  # Inicialmente, nenhum banco de dados é especificado

# Criação da URL de conexão sem banco de dados
connection_url = f'{DATABASE_TYPE}+{DBAPI}://{USER}:{PASSWORD}@{ENDPOINT}:{PORT}'
engine = create_engine(connection_url)

def execute_sql_file(file_path):
    if os.path.exists(file_path):
        with engine.connect() as connection:
            with open(file_path, 'r', encoding='utf-8') as file:
                sql_script = file.read()
            
            for statement in sql_script.split(';'):
                if statement.strip():
                    connection.execute(text(statement.strip()))
            
            print(f"Script SQL {file_path} executado com sucesso.")
    else:
        print(f"Arquivo {file_path} não encontrado.")

def execute_sql_files(file_paths):
    try:
        with engine.connect() as connection:
            for file_path in file_paths:
                if os.path.exists(file_path):
                    with open(file_path, 'r', encoding='utf-8') as file:
                        sql_script = file.read()
                    
                    for statement in sql_script.split(';'):
                        if statement.strip():
                            connection.execute(text(statement.strip()))
                    
                    # Confirmar transações (se necessário)
                    # connection.execute(text('COMMIT;')) # Remova se não for necessário
                    
                    print(f"Script SQL {file_path} executado com sucesso.")
                else:
                    print(f"Arquivo {file_path} não encontrado.")
    except Exception as e:
        print(f"Erro ao executar o script SQL: {e}")

# Caminho para o arquivo SQL de deletar o banco de dados
file_path = rf'./SQLs/deletar_banco/deletar_bd.sql'
execute_sql_file(file_path)

# Caminho para o arquivo SQL de criação do banco de dados
file_path = rf'./SQLs/criar banco/criar_bd.sql'
execute_sql_file(file_path)

# Atualização da configuração para o banco de dados específico
DATABASE = db_name
connection_url = f'{DATABASE_TYPE}+{DBAPI}://{USER}:{PASSWORD}@{ENDPOINT}:{PORT}/{DATABASE}'
engine = create_engine(connection_url)

# Lista de arquivos SQL
file_paths = [
    #tabelas em comum
    rf'./SQLs/tabelas_em_comum/criar_mse.sql',

    #tabelas dos usuarios
    rf'./SQLs/tabelas_sobre_usuarios/criar_perfil.sql',
    rf'./SQLs/tabelas_sobre_usuarios/criar_usuarios.sql',

    #tabelas de dimensão para adolescentes
    rf'./SQLs/tabelas_sobre_adolescentes/criar_alcool_ou_drogas.sql',
    rf'./SQLs/tabelas_sobre_adolescentes/criar_cicloEstudo.sql',
    rf'./SQLs/tabelas_sobre_adolescentes/criar_contatos.sql',
    rf'./SQLs/tabelas_sobre_adolescentes/criar_creas.sql',
    rf'./SQLs/tabelas_sobre_adolescentes/criar_deficiencia.sql',
    rf'./SQLs/tabelas_sobre_adolescentes/criar_distrito.sql',
    rf'./SQLs/tabelas_sobre_adolescentes/criar_ubs.sql',
    rf'./SQLs/tabelas_sobre_adolescentes/criar_estado_civil.sql',
    rf'./SQLs/tabelas_sobre_adolescentes/criar_genero.sql',
    rf'./SQLs/tabelas_sobre_adolescentes/criar_medidas_mse.sql',
    rf'./SQLs/tabelas_sobre_adolescentes/criar_modalidadeEnsino.sql',
    rf'./SQLs/tabelas_sobre_adolescentes/criar_nacionalidade.sql',
    rf'./SQLs/tabelas_sobre_adolescentes/criar_orientacao_sexual.sql',
    rf'./SQLs/tabelas_sobre_adolescentes/criar_paroudeEstudar.sql',
    rf'./SQLs/tabelas_sobre_adolescentes/criar_programas_sociais.sql',
    rf'./SQLs/tabelas_sobre_adolescentes/criar_raca.sql',
    rf'./SQLs/tabelas_sobre_adolescentes/criar_trabalho.sql',
    rf'./SQLs/tabelas_sobre_adolescentes/criar_sas.sql',
    rf'./SQLs/tabelas_sobre_adolescentes/criar_servico_familia.sql',
    rf'./SQLs/tabelas_sobre_adolescentes/criar_situacao_processo.sql',
    rf'./SQLs/tabelas_sobre_adolescentes/criar_tipo_de_contato.sql',
    rf'./SQLs/tabelas_sobre_adolescentes/criar_tipoEscola.sql',
    rf'./SQLs/tabelas_sobre_adolescentes/criar_vara_da_infancia.sql',
    rf'./SQLs/tabelas_sobre_adolescentes/criar_processos.sql',
    
    #pessoas cria depois porque depende das dimensões
    rf'./SQLs/tabelas_sobre_adolescentes/criar_pessoas.sql',
    
    #contatos pessoas depois porque depende das contatos e das pessoas
    rf'./SQLs/tabelas_sobre_adolescentes/criar_contatos_pessoas.sql',
    
    #programas sociais pessoas depois porque depende das pessoas
    rf'./SQLs/tabelas_sobre_adolescentes/criar_programas_sociais_pessoas.sql',
    
    #criar tabelas de historico
    rf'./SQLs/trigger/criacao_tabelas_historico.sql',
    
    #criar triggers
    rf'./SQLs/trigger/criacao_trigger.sql'
    
]

time.sleep(5)
execute_sql_files(file_paths)
