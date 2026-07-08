# Requisitos — Gerência Azul Pitanga

Este documento é a fonte única de verdade dos requisitos do sistema. Os três agentes de IA do projeto (`frontend-react`, `backend-flask`, `database-sql`) devem consultá-lo antes de implementar qualquer funcionalidade e, ao concluir uma tarefa, indicar explicitamente quais códigos de requisito (RF/RNF) foram atendidos.

## Requisitos Funcionais

| Código | Requisito | Módulo | Prioridade |
|---|---|---|---|
| RF01 | Permitir cadastro e acompanhamento de projetos com suas respectivas fases e andamento | Gestão de projetos e tarefas | Alta |
| RF02 | Permitir atribuição de tarefas a membros específicos da equipe | Gestão de projetos e tarefas | Alta |
| RF03 | Exibir visão kanban das tarefas integrada à página do projeto, sem exigir navegação extra | Gestão de projetos e tarefas | Alta |
| RF04 | Permitir múltiplas tarefas simultâneas por usuário com indicação de status individual | Gestão de projetos e tarefas | Alta |
| RF05 | Possibilitar edição fácil e ágil de tarefas diretamente na interface principal | Gestão de projetos e tarefas | Alta |
| RF06 | Categorizar projetos por tipo (residencial, interiores, comercial, efêmera) com ícones ou símbolos | Gestão de projetos e tarefas | Média |
| RF07 | Registrar horas trabalhadas por fase de projeto com cronômetro integrado | Controle de horas | Alta |
| RF08 | Gerar relatório de horas por projeto e por fase para análise interna (não para precificação) | Controle de horas | Média |
| RF09 | Registrar atas e informações de reuniões associadas a projetos específicos | Reuniões e comunicação | Média |
| RF10 | Enviar notificações e lembretes de prazos de entrega e reuniões | Reuniões e comunicação | Média |
| RF11 | Armazenar informações e documentos dos clientes vinculados a cada projeto | Cadastro de clientes e fornecedores | Alta |
| RF12 | Manter cadastro de contatos de fornecedores organizados por projeto | Cadastro de clientes e fornecedores | Média |
| RF13 | Disponibilizar visualização de cronograma por projeto com prazos e marcos | Cronograma | Alta |

## Requisitos Não Funcionais

| Código | Requisito | Prioridade |
|---|---|---|
| RNF01 | O sistema deve ser acessível via web, sem necessidade de instalação local | Alta |
| RNF02 | A interface deve ser visualmente simples, mas funcionalmente completa (sem sobrecarga visual) | Alta |
| RNF03 | O sistema deve funcionar adequadamente em notebooks e smartphones (responsividade) | Alta |
| RNF04 | O sistema deve ter uso estritamente interno, sem acesso ou participação do cliente final | Alta |
| RNF05 | Desempenho satisfatório em conexões de internet de qualidade moderada | Média |
| RNF06 | Suportar uso simultâneo por mais de um usuário na mesma fase de projeto | Média |
| RNF07 | Ser acessível tanto em ambiente de escritório quanto em home office (híbrido) | Média |
| RNF08 | Permitir migração total do fluxo atual (substituição completa do Notion) | Alta |
| RNF09 | A navegação entre módulos (projeto → kanban → horas) deve ser fluida e sem quebras de contexto | Alta |

## Leituras importantes para os agentes

- **RNF04** implica que **não existe papel de "cliente" com login no sistema** — `clientes` é uma entidade de cadastro (dados/documentos), não um tipo de usuário autenticado. Toda a aplicação (frontend e backend) é de uso interno da equipe do escritório.
- **RNF06** implica que o backend e o schema devem tolerar edições concorrentes na mesma fase/tarefa (ex.: `atualizado_em` para detectar conflitos, evitar locks pessimistas de longa duração).
- **RNF08** implica que o volume de entidades deve ser suficiente para substituir o fluxo atual do Notion do escritório: projetos, fases, tarefas, horas, reuniões, clientes, fornecedores e cronograma — não apenas um subconjunto.
- **RNF09** implica que, no frontend, a página do projeto deve integrar kanban (RF03) e o resumo de horas (RF07/RF08) sem exigir troca de rota/tela separada — isso é um requisito de UX, não apenas de API.
