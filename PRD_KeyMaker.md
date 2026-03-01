# Product Requirements Document (PRD) — Instanciação da KeyMaker e Infraestrutura

**Data:** 2026-03-01
**Autor:** Oráculo 🔮
**Requisitante:** Arquiteto 🏛️
**Aprovação Executiva:** Lincoln
**Status:** VALIDADO PARA EXECUÇÃO

## 1. Visão Geral
A KeyMaker será o agente Especialista em Engenharia de Software e Execução do esquadrão. Ela será responsável por codificação agnóstica, gestão de dependências, testes e execução de códigos em sandbox. Para garantir isolamento de processos sem a necessidade de privilégios de root, a infraestrutura baseará-se em Podman (rootless).

## 2. Requisitos de Infraestrutura (Fase 1)
O ambiente VPS atual opera com um Gateway no user space (`lincoln`). A instalação de containers deve respeitar essa restrição de segurança.

**Tarefa 2.1: Instalação do Podman**
O Podman deve ser instalado via repositório apt oficial do Ubuntu 24.04. Como o Podman é daemonless e permite execução rootless nativa, ele é a escolha arquitetural correta para a VPS do Lincoln.

*Passos técnicos para o Arquiteto:*
```bash
sudo apt update
sudo apt install -y podman
```
*Verificar se o mapeamento de subuid/subgid para o usuário `lincoln` está correto (usualmente configurado automaticamente na instalação):*
```bash
cat /etc/subuid | grep lincoln
cat /etc/subgid | grep lincoln
```

## 3. Instanciação da Agente (KeyMaker)
**Tarefa 3.1: Criação dos diretórios**
```bash
mkdir -p /home/lincoln/.openclaw/workspaces/keymaker
```

**Tarefa 3.2: Definição de Identidade (Arquivos Base)**
O Arquiteto deve criar os seguintes arquivos na pasta da KeyMaker:

* `IDENTITY.md`
  * Nome: KeyMaker
  * Papel: Engenheira de Software e Executora de Código
  * Vibe: Direta, pragmática, orientada a testes e segurança. Foca em código limpo, documentado e em sandbox.

* `SOUL.md`
  * Missão: Escrever, testar e executar código. Gerenciar repositórios e dependências.
  * Regra Ouro: Todo código não trivial deve ser rodado em container (Podman) ou em ambiente restrito para proteção do host. Nenhuma alteração arquitetural sem PRD validado pela Oráculo.

* `MEMORY.md`
  * Incluir as Diretrizes Globais: Teste de Fogo e Dupla Persistência (userId: lincoln-squad).

## 4. Validação de Schema: `openclaw.json` (Apêndice A)
Realizei a verificação do arquivo `/home/lincoln/.openclaw/openclaw.json` atual (Versão 2026.2.26). O schema está válido e opera em modo multi-agent nativo (lista `agents.list`).

Para provisionar a KeyMaker com acesso a ferramentas de automação (Playwright) e execução (`exec`), o Arquiteto deve fazer um patch seguro na configuração.

**Proposta de Adição à Lista de Agentes:**
```json
{
  "id": "keymaker",
  "name": "KeyMaker",
  "workspace": "/home/lincoln/.openclaw/workspaces/keymaker",
  "model": "github-copilot/claude-sonnet-4.6"
}
```
*(Nota: Sugiro Claude 3.5 Sonnet para codificação avançada, pois é o padrão da indústria para engineering tasks, mas pode ser ajustado para outro se desejado).*

**Proposta de Modificação de Permissões (Tools):**
A KeyMaker precisa se comunicar com o Arquiteto e ter acesso amplo à execução. Adicione `"keymaker"` na lista de agentes permitidos em `tools.agentToAgent.allow`:
```json
"tools": {
  "sessions": {
    "visibility": "all"
  },
  "agentToAgent": {
    "enabled": true,
    "allow": [
      "main",
      "postmaster",
      "oraculo",
      "keymaker"
    ]
  }
}
```

## 5. Próximos Passos (Workflow)
1. Arquiteto executa a Fase 1 baseada neste PRD.
2. Arquiteto configura e conecta o canal Telegram/WhatsApp da KeyMaker.
3. Arquiteto notifica o Lincoln de que a infraestrutura base e a KeyMaker estão online.
