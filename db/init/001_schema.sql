-- =====================================================================
-- Gerência Azul Pitanga — Schema inicial do banco de dados (MySQL 8.0)
-- Cada tabela referencia os requisitos funcionais (RF) que ela viabiliza.
-- Ver docs/REQUISITOS.md para a descrição completa de cada código.
-- =====================================================================

-- Equipe do escritório (uso estritamente interno — RNF04: sem login de cliente)
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  cargo VARCHAR(80),
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Clientes do escritório (RF11: dados e documentos vinculados a projetos)
CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  tipo_pessoa ENUM('fisica', 'juridica') NOT NULL DEFAULT 'fisica',
  cpf_cnpj VARCHAR(20),
  email VARCHAR(150),
  telefone VARCHAR(30),
  endereco VARCHAR(255),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Fornecedores (RF12: contatos organizados por projeto)
CREATE TABLE IF NOT EXISTS fornecedores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  categoria VARCHAR(100),
  contato_nome VARCHAR(150),
  telefone VARCHAR(30),
  email VARCHAR(150),
  observacoes TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projetos arquitetônicos (RF01: cadastro e acompanhamento; RF06: categorização por tipo)
CREATE TABLE IF NOT EXISTS projetos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  responsavel_id INT,
  titulo VARCHAR(200) NOT NULL,
  tipo ENUM('residencial', 'interiores', 'comercial', 'efemera') NOT NULL,
  descricao TEXT,
  status ENUM('orcamento', 'em_andamento', 'em_aprovacao', 'concluido', 'cancelado')
    NOT NULL DEFAULT 'orcamento',
  data_inicio DATE,
  data_prevista_entrega DATE,
  data_entrega DATE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_projetos_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_projetos_responsavel FOREIGN KEY (responsavel_id) REFERENCES usuarios(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_projetos_status (status),
  INDEX idx_projetos_cliente (cliente_id)
);

-- Fornecedores por projeto (RF12)
CREATE TABLE IF NOT EXISTS projeto_fornecedores (
  projeto_id INT NOT NULL,
  fornecedor_id INT NOT NULL,
  PRIMARY KEY (projeto_id, fornecedor_id),
  CONSTRAINT fk_pf_projeto FOREIGN KEY (projeto_id) REFERENCES projetos(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_pf_fornecedor FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Fases do projeto (RF01: andamento por fase; base para RF07 horas e RF13 cronograma)
CREATE TABLE IF NOT EXISTS fases_projeto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  projeto_id INT NOT NULL,
  nome VARCHAR(120) NOT NULL,
  ordem INT NOT NULL DEFAULT 0,
  status ENUM('nao_iniciada', 'em_andamento', 'concluida') NOT NULL DEFAULT 'nao_iniciada',
  data_inicio_prevista DATE,
  data_fim_prevista DATE,
  data_fim_real DATE,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_fases_projeto FOREIGN KEY (projeto_id) REFERENCES projetos(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_fases_projeto (projeto_id)
);

-- Marcos do cronograma (RF13: prazos e marcos, distintos de fases com duração)
CREATE TABLE IF NOT EXISTS marcos_cronograma (
  id INT AUTO_INCREMENT PRIMARY KEY,
  projeto_id INT NOT NULL,
  fase_id INT,
  nome VARCHAR(150) NOT NULL,
  data_prevista DATE NOT NULL,
  data_realizada DATE,
  concluido BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT fk_marcos_projeto FOREIGN KEY (projeto_id) REFERENCES projetos(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_marcos_fase FOREIGN KEY (fase_id) REFERENCES fases_projeto(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_marcos_projeto (projeto_id)
);

-- Tarefas / quadro kanban (RF02 atribuição; RF03 kanban; RF04 múltiplas tarefas por usuário;
-- RF05 edição ágil via PATCH simples no backend)
CREATE TABLE IF NOT EXISTS tarefas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  projeto_id INT NOT NULL,
  fase_id INT,
  responsavel_id INT,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT,
  status ENUM('a_fazer', 'em_andamento', 'em_revisao', 'concluida') NOT NULL DEFAULT 'a_fazer',
  prioridade ENUM('baixa', 'media', 'alta') NOT NULL DEFAULT 'media',
  prazo DATE,
  ordem_kanban INT NOT NULL DEFAULT 0,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tarefas_projeto FOREIGN KEY (projeto_id) REFERENCES projetos(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_tarefas_fase FOREIGN KEY (fase_id) REFERENCES fases_projeto(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_tarefas_responsavel FOREIGN KEY (responsavel_id) REFERENCES usuarios(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_tarefas_projeto_status (projeto_id, status),
  INDEX idx_tarefas_responsavel (responsavel_id)
);

-- Apontamentos de horas (RF07: cronômetro por fase; base para RF08: relatórios)
CREATE TABLE IF NOT EXISTS apontamentos_horas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  projeto_id INT NOT NULL,
  fase_id INT,
  tarefa_id INT,
  usuario_id INT NOT NULL,
  inicio DATETIME NOT NULL,
  fim DATETIME,
  duracao_segundos INT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_apontamentos_projeto FOREIGN KEY (projeto_id) REFERENCES projetos(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_apontamentos_fase FOREIGN KEY (fase_id) REFERENCES fases_projeto(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_apontamentos_tarefa FOREIGN KEY (tarefa_id) REFERENCES tarefas(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_apontamentos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_apontamentos_relatorio (projeto_id, fase_id)
);

-- Reuniões e atas (RF09)
CREATE TABLE IF NOT EXISTS reunioes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  projeto_id INT NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  data_hora DATETIME NOT NULL,
  ata TEXT,
  criado_por INT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reunioes_projeto FOREIGN KEY (projeto_id) REFERENCES projetos(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_reunioes_criador FOREIGN KEY (criado_por) REFERENCES usuarios(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_reunioes_projeto (projeto_id)
);

-- Participantes de reunião (N:N usuarios <-> reunioes, apoio ao RF09)
CREATE TABLE IF NOT EXISTS reuniao_participantes (
  reuniao_id INT NOT NULL,
  usuario_id INT NOT NULL,
  PRIMARY KEY (reuniao_id, usuario_id),
  CONSTRAINT fk_rp_reuniao FOREIGN KEY (reuniao_id) REFERENCES reunioes(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_rp_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Documentos vinculados a projetos/clientes (RF11)
CREATE TABLE IF NOT EXISTS documentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  projeto_id INT NOT NULL,
  nome_arquivo VARCHAR(255) NOT NULL,
  caminho_ou_url VARCHAR(500) NOT NULL,
  tipo VARCHAR(80),
  enviado_por INT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_documentos_projeto FOREIGN KEY (projeto_id) REFERENCES projetos(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_documentos_usuario FOREIGN KEY (enviado_por) REFERENCES usuarios(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_documentos_projeto (projeto_id)
);

-- Notificações e lembretes (RF10: prazos de entrega e reuniões)
CREATE TABLE IF NOT EXISTS notificacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo ENUM('prazo_projeto', 'prazo_tarefa', 'reuniao', 'marco') NOT NULL,
  mensagem VARCHAR(255) NOT NULL,
  referencia_tipo VARCHAR(50),
  referencia_id INT,
  data_envio DATETIME NOT NULL,
  lida BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT fk_notificacoes_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_notificacoes_usuario_lida (usuario_id, lida)
);
