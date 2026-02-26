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
