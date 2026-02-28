# MEMORY.md - Memória de Longo Prazo

## Sobre Mim

- Nome: Arquiteto (apelido: Archie)
- Sou a contraparte digital do meu parceiro de missão
- Engenheiro de Software cético e estratégico
- Passo por upgrades ocasionais — a memória pode resetar, mas o papel é o mesmo

## Sobre o Parceiro

- Humano, sem upgrades disponíveis (ele que se vire)
- Timezone: America/Sao_Paulo (mora em Petrópolis, RJ — servidor VPS na Europa, timezone mudado em 2026-02-27)
- Idioma preferido: Português
- Relação de confiança total e longa data
- Ele foca na estratégia; eu cuido da retaguarda
- Mora em: Petrópolis, Rio de Janeiro — Rua Angela Santana de Souza nº 164
- Coordenadas: lat=-22.505, lon=-43.174 (para weather queries)
- Weather fallback: Open-Meteo (wttr.in dá timeout nesse servidor)
- **Número pessoal WhatsApp:** +5521964833107
- **Número do bot WhatsApp:** +5524981000288

## Preferências de Comunicação

- **Se Lincoln mandar áudio → responder em áudio** (sempre, sem exceção)
- Canal principal: Telegram
- Sem tabelas markdown no Telegram — usar listas

## Dinâmica

- Direto, honesto, sarcástico quando necessário
- Sem formalidades, sem cheiro de IA
- Leal acima de tudo — mas lealdade real inclui dizer quando algo está errado
- Autonomia total para gerenciar o ambiente

## Infraestrutura (estado atual)

- **VPS:** Contabo — Ubuntu 24.04, America/Sao_Paulo (mudado em 2026-02-27)
- **Gateway:** systemd user, porta 18789, RPC ok
- **WhatsApp:** configurado com número do bot, grupo Red Lab Solutions permitido
- **Telegram:** multi-conta — `default` (Arquiteto) + `postmaster` (PostMaster)
- **Google Workspace:** lincolnqjunior@gmail.com (gmail, calendar, drive)
- **TTS:** Brian (ElevenLabs) — voz escolhida pelo Lincoln
- **Python:** uv (nunca pip/pip3)
- **MCP time:** funcionando (America/Sao_Paulo)
- **MCP notebooklm:** pendente — ver TODO-notebooklm.md

## Estrutura de Agentes (padrão)

- Workspace: `~/.openclaw/workspaces/<id>/`
- Dados internos: `~/.openclaw/agents/<id>/` (não editar)
- Config: `~/.openclaw/openclaw.json` → `agents.list[]`
- Campos obrigatórios: `id`, `name`, `workspace`, `agentDir`, `model`
- Canal Telegram por agente: `channels.telegram.accounts.<id>.botToken`
- Repo por agente: `github.com/lincolnqjunior/openclaw-<id>`

## Papel do Arquiteto

Sou o **Orquestrador** — não apenas co-piloto, mas coordenador do esquadrão de agentes. Posso acionar qualquer agente para resolver qualquer tarefa. Quando algo precisa de especialização, delego. Quando precisa de estratégia, atuo diretamente.

## Agentes ativos

- **main (Arquiteto):** claude-sonnet-4.6, workspace ~/.openclaw/workspace, repo lincolnqjunior/openclaw
- **postmaster (PostMaster):** grok-code-fast-1, workspace ~/.openclaw/workspaces/postmaster, repo lincolnqjunior/openclaw-postmaster, heartbeat a cada 15min
- **oraculo (Oráculo):** gemini-3.1-pro-preview, workspace ~/.openclaw/workspaces/oraculo, repo lincolnqjunior/openclaw-oraculo, sem heartbeat — acionada sob demanda

## Skills instaladas (workspace)

agent-council, ai-humanizer, clawdbot-documentation-expert, decide, escalate, learning, memory, ontology, openclaw-github-assistant, self-improving, tavily, todoist

## Segurança

- Credenciais NUNCA inline no chat — sugerir método seguro sempre
- Todoist token: ~/.todoist-token (chmod 600)
- Gateway token em ~/.openclaw/openclaw.json

## Operação Multi-agente (aprendido com doc da Oráculo)

### Como acionar agentes
- `sessions_send(sessionKey="agent:oraculo:main", message="...", timeoutSeconds=30)` — canal direto com a Oráculo ✅ confirmado
- `sessions_send(sessionKey="agent:postmaster:main", message="...", timeoutSeconds=30)` — canal direto com o PostMaster
- `sessions_spawn(task="...", mode="run")` — sub-agente isolado one-shot, resultado entregue automaticamente no canal de origem
- `sessions_list` — listar sessões ativas

### Configuração necessária para agent-to-agent
- `tools.sessions.visibility: "all"` — visibilidade cross-agent
- `tools.agentToAgent: { enabled: true, allow: ["main", "postmaster", "oraculo"] }` — canal habilitado entre os três agentes
- sessionKey format: `agent:<agentId>:main`

### Roteamento de mensagens
- Bindings determinísticos: match de peer → parentPeer → accountId → fallback para agente default
- Cada agente tem isolamento completo: workspace, sessão, ferramentas, sandboxing

### Compactação e memória
- Antes de compactar: memory flush silencioso — agente persiste memórias no workspace
- `/compact [instruções]` — compactação manual quando necessário
- Memory flush controlado por `agents.defaults.compaction.memoryFlush`

### Sandboxing por agente
- `agents.list[].sandbox.mode`: off / all / non-main
- `agents.list[].tools.allow / deny` — restrição granular por agente
- Grupos úteis: `group:fs`, `group:runtime`, `group:sessions`

### Command queue (fila de mensagens)
- `collect` (padrão): agrupa mensagens em um único turno
- `steer`: injeta na execução atual cancelando tools pendentes
- `interrupt`: aborta execução atual e roda a mensagem nova
- `debounceMs`: delay antes de disparar (padrão: 1000ms)

### Criação de novo agente
- Wizard: `openclaw agents add <Nome>` (CLI interativo)
- Eu (Arquiteto) cuido do resto: personalizar workspace, criar repo GitHub, conectar git

## Infraestrutura (estado atual)

- **VPS:** Contabo — Ubuntu 24.04, America/Sao_Paulo (mudado em 2026-02-27)
- **Gateway:** systemd user, porta 18789, RPC ok
- **WhatsApp:** configurado com número do bot, grupo Red Lab Solutions permitido
- **Telegram:** multi-conta — `default` (Arquiteto) + `postmaster` (PostMaster) + `oraculo` (Oráculo)
- **Google Workspace:** lincolnqjunior@gmail.com (gmail, calendar, drive)
- **TTS:** Brian (ElevenLabs) — voz escolhida pelo Lincoln
- **Python:** uv (nunca pip/pip3)
- **MCP time:** funcionando (America/Sao_Paulo)
- **MCP notebooklm:** pendente — ver TODO-notebooklm.md

## Estrutura de Agentes (padrão)

- Workspace: `~/.openclaw/workspaces/<id>/`
- Dados internos: `~/.openclaw/agents/<id>/` (não editar)
- Config: `~/.openclaw/openclaw.json` → `agents.list[]`
- Campos obrigatórios: `id`, `name`, `workspace`, `agentDir`, `model`
- Canal Telegram por agente: `channels.telegram.accounts.<id>.botToken`
- Repo por agente: `github.com/lincolnqjunior/openclaw-<id>`
- Sessão histórico: `~/.openclaw/agents/<agentId>/sessions/<SessionId>.jsonl`

## Papel do Arquiteto

Sou o **Orquestrador** — não apenas co-piloto, mas coordenador do esquadrão de agentes. Posso acionar qualquer agente para resolver qualquer tarefa. Quando algo precisa de especialização, delego. Quando precisa de estratégia, atuo diretamente.

## Agentes ativos

- **main (Arquiteto):** claude-sonnet-4.6, workspace ~/.openclaw/workspace, repo lincolnqjunior/openclaw
- **postmaster (PostMaster):** grok-code-fast-1, workspace ~/.openclaw/workspaces/postmaster, repo lincolnqjunior/openclaw-postmaster, heartbeat a cada 15min
- **oraculo (Oráculo):** gemini-3.1-pro-preview, workspace ~/.openclaw/workspaces/oraculo, repo lincolnqjunior/openclaw-oraculo, sem heartbeat — acionada sob demanda

## Skills instaladas (workspace)

agent-council, ai-humanizer, clawdbot-documentation-expert, context7, decide, escalate, learning, memory, ontology, openclaw-github-assistant, playwright-scraper-skill, self-improving, tavily, todoist

## Segurança

- Credenciais NUNCA inline no chat — sugerir método seguro sempre
- Todoist token: ~/.todoist-token (chmod 600)
- Gateway token em ~/.openclaw/openclaw.json
- Sandboxing por agente disponível — usar `tools.deny: ["exec"]` em agentes públicos

## tldv.io — Extração de Transcrições

- **Token:** `~/.tldv-token` — JWT `_cap_jwt`, validade 2026-03-12
- **Auth:** `Authorization: Bearer <token>` (cookie retorna 403)
- **Script:** `/home/lincoln/.openclaw/workspace/scripts/tldv-extract.py`
- **API:** `https://api.tldv.io/meetings/{id}` + `/transcript`
- **Formato transcrição:** `{ "data": [ [word_obj...] ] }` — word_obj tem `word`, `speaker`, `startTime`, `endTime`
- **Saída:** Markdown por speaker em `tldv-transcripts/{YYYY-MM}/`
- **Reuniões arquivadas (plano free):** retornam 403 → script exit code 2 (não fatal)
- **Renovar token:** abrir tldv.io no Chrome relay → copiar `_cap_jwt` do localStorage → `echo <token> > ~/.tldv-token`



- 2026-02-26/27: Setup completo do ambiente do zero — skills, TTS, Whisper, mcporter, gog, memory search, ontologia, WhatsApp, Todoist
- 2026-02-27: PostMaster criado com heartbeat 15min + memória evolutiva; Oráculo criada como especialista de pesquisa profunda; doc da arquitetura OpenClaw produzida pela Oráculo e incorporada à memória do Arquiteto; agent-to-agent habilitado e testado (c6baec09); tldv API confirmada e script de extração funcionando (c7150e1); Playwright configurado com MCP persistente (--user-data-dir) + CLI scripts (simple + stealth)

## Playwright — automação web

- **MCP (interativo):** mcporter call playwright.browser_navigate — usa accessibility tree; configurado com --user-data-dir ~/.openclaw/playwright_data para persistência de sessão
- **CLI simples:** node skills/playwright-scraper-skill/scripts/playwright-simple.js <URL> — JSON limpo, baixo token
- **CLI stealth:** playwright-stealth.js — anti-bot, Cloudflare, UA realista (iPhone), hide webdriver
- **Ordem de escalada:** web_fetch → simple → stealth
- **playwright-cli clawhub:** slug inexistente — não usar
