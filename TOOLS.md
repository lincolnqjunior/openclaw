# TOOLS.md - Infraestrutura e Configuração do Ambiente

Configurações técnicas, credenciais e detalhes de instalação. Para **como usar** cada skill, ver SKILLS.md.

---

## Gateway

- **Porta:** 18789 (loopback)
- **Serviço:** systemd user (`~/.config/systemd/user/openclaw-gateway.service`)
- **Config:** `~/.openclaw/openclaw.json`
- **Restart:** `openclaw gateway restart` — confirmar com `openclaw gateway status` em seguida (não depender do retorno do exec)

**Variáveis injetadas no serviço:**
- `GOG_KEYRING_PASSWORD` — keyring do gog
- `GOG_ACCOUNT=lincolnqjunior@gmail.com`
- `ELEVENLABS_API_KEY`
- `ELEVENLABS_VOICE_ID=nPczCjzI2devNBz1zQrb` (Brian)
- `LD_LIBRARY_PATH=/home/linuxbrew/.linuxbrew/lib` (libasound para sag)

---

## Google Workspace (gog v0.11.0)

- **Conta:** lincolnqjunior@gmail.com
- **Serviços:** gmail, calendar, drive
- **Credentials:** `~/.openclaw/gog-client-secret.json` (projeto: clawdbot-desktop-lincoln)
- **Config:** `~/.config/gogcli/`
- **Keyring:** file backend, senha via systemd

---

## TTS — sag (ElevenLabs v0.2.2)

- **Voz:** Brian — Deep, Resonant (`nPczCjzI2devNBz1zQrb`) — escolhida pelo Lincoln em 2026-02-26
- **Modelo:** `eleven_v3`
- **Dependência:** libasound via `LD_LIBRARY_PATH=/home/linuxbrew/.linuxbrew/lib`
- **Envio de áudio:** copiar mp3 para workspace antes de enviar (path `/tmp` bloqueado pelo message tool)

---

## Whisper — Transcrição de Áudio

- **Provider:** OpenAI API (`whisper-1`)
- **Script:** `~/.npm-global/lib/node_modules/openclaw/skills/openai-whisper-api/scripts/transcribe.sh`
- **Permissão:** `chmod +x` necessário na primeira execução
- **Formatos:** ogg, mp3, m4a, wav, webm

---

## ffmpeg

- **Versão:** 8.0.1 — instalado via brew
- **Path:** `/home/linuxbrew/.linuxbrew/bin/ffmpeg`

---

## Memory Search

- **Provider:** openai (`text-embedding-3-small`)
- **Mode:** hybrid (BM25 0.3 + vector 0.7), MMR λ=0.7, temporal decay halfLife=30d
- **Cache:** 50.000 entradas
- **Índice:** `~/.openclaw/memory/main.sqlite`

---

## Python / uv

- **pip/pip3 NÃO disponíveis** nesse sistema — usar `uv` sempre
- **uv path:** `/home/linuxbrew/.linuxbrew/bin/uv`
- **Tavily venv:** `~/.tavily-env` (tavily-python 0.7.22)
- Criar venv: `uv venv <path> && uv pip install --python <path>/bin/python <pkg>`

---

## mcporter (MCP Client v0.7.3)

- **Config:** `./config/mcporter.json` (relativo ao workspace)
- `mcporter list` / `mcporter call <server.tool> key=value` / `mcporter config add`
- Sempre rodar com `cd /home/lincoln/.openclaw/workspace` antes (config é path relativo)

### MCPs configurados

| Server | Tipo | Status | Notas |
|--------|------|--------|-------|
| `time` | stdio | ✅ online | Python `~/.mcp-env`, timezone America/Sao_Paulo |
| `notebooklm` | stdio | on-demand | npx, conecta quando chamado |
| `context7` | stdio | on-demand | npx + DEFAULT_MINIMUM_TOKENS=10000 |

- **Python env para MCPs:** `~/.mcp-env` (uv venv, mcp-server-time instalado)
- **Timezone:** server OS = Europe/Berlin, mas MCPs usam America/Sao_Paulo explicitamente

---

## WhatsApp

- **Número do bot:** +5524981000288
- **Número pessoal Lincoln:** +5521964833107
- **Grupo ativo:** Red Lab Solutions (`120363406935049097@g.us`)
- **Config:** `groupPolicy: allowlist`, `groupAllowFrom: ["+5521964833107"]`, `groups: ["120363406935049097@g.us"]`
- **Credenciais:** `~/.openclaw/credentials/whatsapp/`

---

## Todoist

- **CLI:** todoist-ts-cli (global npm)
- **Token:** `~/.todoist-token` (chmod 600) + `TODOIST_API_TOKEN` no systemd
- **Uso:** `TODOIST_API_TOKEN=$(cat ~/.todoist-token) todoist <cmd>`

---



- **GitHub:** lincolnqjunior/openclaw — branch `main`
- **Workspace:** `/home/lincoln/.openclaw/workspace`
- Commitar após mudanças significativas

---

## Estrutura de Agentes (padrão OpenClaw)

O OpenClaw usa estrutura separada para workspaces e dados internos dos agentes:

- **Workspace do agente:** `~/.openclaw/workspaces/<id>/` — arquivos editáveis (SOUL, HEARTBEAT, memory, etc.)
- **Dados internos:** `~/.openclaw/agents/<id>/` — sessions, auth (gerenciado pelo gateway, não editar)
- **Config do gateway:** `~/.openclaw/openclaw.json` → `agents.list[]`

### Campos obrigatórios no config do agente

```json
{
  "id": "agent-id",
  "name": "Nome do Agente",
  "workspace": "/home/lincoln/.openclaw/workspaces/agent-id",
  "agentDir": "/home/lincoln/.openclaw/agents/agent-id/agent",
  "model": "provider/model-name"
}
```

### Canal dedicado por agente (Telegram multi-conta)

Cada agente pode ter uma conta Telegram separada:
- Criar bot no BotFather → obter token
- Adicionar em `channels.telegram.accounts.<id>.botToken`
- Criar binding: `{ agentId: "<id>", match: { channel: "telegram", accountId: "<id>" } }`

### Repositório por agente

Padrão: `github.com/lincolnqjunior/openclaw-<agent-id>`
Workspace tem `.git` apontando para esse repositório.

### Agentes ativos

| ID | Nome | Modelo | Workspace | Repo |
|----|------|--------|-----------|------|
| main | Arquiteto | claude-sonnet-4.6 | ~/.openclaw/workspace | lincolnqjunior/openclaw |
| postmaster | PostMaster | grok-code-fast-1 | ~/.openclaw/workspaces/postmaster | lincolnqjunior/openclaw-postmaster |

---

## Segurança

- Credenciais/senhas: **nunca inline no chat** — sugerir alternativa segura antes de receber
- `trash` > `rm`
- Ações externas (email, post público): perguntar antes
