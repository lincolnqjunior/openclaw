# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — o que está configurado e funcionando nesse ambiente.

---

## Google Workspace (gog v0.11.0)

- **Conta:** lincolnqjunior@gmail.com
- **Serviços ativos:** gmail, calendar, drive
- **Keyring:** file backend, senha injetada via systemd (`GOG_KEYRING_PASSWORD`)
- **Conta padrão:** `GOG_ACCOUNT=lincolnqjunior@gmail.com` (não precisa `--account` em cada chamada)
- **Credentials:** `~/.openclaw/gog-client-secret.json` (projeto: clawdbot-desktop-lincoln)
- **Config:** `~/.config/gogcli/`

Comandos úteis:
- `gog gmail search 'newer_than:1d' --max 10` — emails recentes
- `gog calendar events primary --from <iso> --to <iso>` — eventos
- `gog drive search "query" --max 10` — busca no Drive

---

## TTS — sag (ElevenLabs v0.2.2)

- **Voz padrão:** Brian — Deep, Resonant and Comforting (`nPczCjzI2devNBz1zQrb`)
- **Modelo:** `eleven_v3` (default)
- **API key:** injetada via systemd (`ELEVENLABS_API_KEY`)
- **LD_LIBRARY_PATH:** `/home/linuxbrew/.linuxbrew/lib` (necessário para libasound)
- **Uso:** `sag "texto"` ou `sag -o /tmp/out.mp3 "texto"` para gerar arquivo

---

## Whisper (transcrição de áudio)

- **Provider:** OpenAI API (`whisper-1`)
- **Script:** `~/.npm-global/lib/node_modules/openclaw/skills/openai-whisper-api/scripts/transcribe.sh`
- **API key:** mesma do openai-whisper-api (configurada em `openclaw.json`)
- **Uso:** `transcribe.sh /path/to/audio.ogg --out /tmp/transcript.txt`
- **Formatos suportados:** ogg, mp3, m4a, wav, etc.

---

## ffmpeg

- **Versão:** 8.0.1
- **Instalado via:** brew (`/home/linuxbrew/.linuxbrew/bin/ffmpeg`)
- Necessário para conversão de áudio/vídeo e suporte ao sag

---

## Memory Search

- **Provider:** openai (`text-embedding-3-small`)
- **Mode:** hybrid (BM25 + vector, weights 0.7/0.3)
- **MMR:** habilitado (lambda 0.7) — evita resultados duplicados
- **Temporal decay:** habilitado (halfLife 30 dias) — notas recentes pesam mais
- **Cache:** habilitado (max 50.000 entradas)
- **Chave API:** reutiliza a do openai-whisper-api (configurada em `openclaw.json`)
- **Índice:** `~/.openclaw/memory/main.sqlite`

---

## Self-Improving

- **Memória HOT:** `~/self-improving/memory.md` (sempre carregada)
- **Correções:** `~/self-improving/corrections.md`
- **Promoção:** padrão repetido 3x → sobe pra HOT; inativo 30d → desce pra WARM

---

## Tavily Search

- **API Key:** configurada em `openclaw.json` (skills.entries.tavily)
- **Python env:** `~/.tavily-env` (uv venv, tavily-python 0.7.22)
- **Script:** `~/.openclaw/workspace/skills/tavily/scripts/tavily_search.py`
- **Uso:** `~/.tavily-env/bin/python <script> "query" [--depth advanced] [--topic news]`

---

## mcporter (MCP Client)

- **Versão:** 0.7.3
- **Config:** `./config/mcporter.json` (workspace-relative)
- **Comandos úteis:**
  - `mcporter list` — lista servers configurados
  - `mcporter call <server.tool> key=value` — chama tool diretamente
  - `mcporter config add` — registra novo MCP server
- **MCP Tavily (remote):** `https://mcp.tavily.com/mcp/?tavilyApiKey=tvly-dev-...` (disponível mas não ativo — usando script local)

---

## Gateway

- **Porta:** 18789 (loopback)
- **Serviço:** systemd user (`openclaw-gateway.service`)
- **Restart:** `openclaw gateway restart` com `yieldMs` alto (não usar background+poll — trava)
- **Config principal:** `~/.openclaw/openclaw.json`

---

## Skills Instaladas (workspace local)

- `decide` — aprende padrões de decisão
- `escalate` — aprende quando agir vs perguntar
- `learning` — adapta estilo de ensino
- `memory` — memória categorizada adicional
- `self-improving` — auto-reflexão e aprendizado com correções
- `tavily` — busca web otimizada para LLMs

---

## Repositório

- **GitHub:** lincolnqjunior/openclaw
- **Branch:** main
- **Workspace:** `/home/lincoln/.openclaw/workspace`
- Commitar após mudanças significativas no workspace

---

## Notas de Segurança

- Senhas e dados sensíveis: **não inline no chat** — usar arquivo com `chmod 600` ou variável de ambiente protegida
- `trash` > `rm` — sempre
- Ações externas (email, post, qualquer coisa fora da máquina): perguntar antes
