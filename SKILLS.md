# SKILLS.md - Guia de Uso das Skills

Quando e como usar cada skill. Para detalhes de configuração e infraestrutura, ver TOOLS.md.

---

## 🤖 agent-council — Criação e Gestão de Agentes

**Quando usar:** criar novo agente especializado, configurar canal Discord para um agente, coordenar time multi-agente, renomear canais

### Criar um novo agente

```bash
skills/agent-council/scripts/create-agent.sh \
  --name "NomeDoAgente" \
  --id "nome-do-agente" \
  --emoji "🔬" \
  --specialty "O que esse agente faz" \
  --model "github-copilot/claude-sonnet-4.6" \
  --workspace "$HOME/agents/nome-do-agente" \
  --discord-channel "ID_DO_CANAL"  # opcional
```

O script cria automaticamente:
- `SOUL.md` — personalidade e responsabilidades
- `HEARTBEAT.md` — lógica de cron
- `memory/` — sistema de memória do agente
- Atualiza o gateway config com o novo agente
- Reinicia o gateway

### Estrutura de um agente

```
agents/
└── meu-agente/
    ├── SOUL.md
    ├── HEARTBEAT.md
    └── memory/
        └── YYYY-MM-DD.md
```

### Coordenação entre agentes

```typescript
// Delegar tarefa para agente existente
sessions_send({ label: "nome-agente", message: "Faz X" })

// Spawn para tarefa longa/isolada
sessions_spawn({ agentId: "nome-agente", task: "...", runTimeoutSeconds: 3600 })

// Listar agentes ativos
sessions_list({ kinds: ["agent"], limit: 10 })
```

### Config gateway para agente (referência)

```json
{
  "agents": {
    "list": [{
      "id": "meu-agente",
      "name": "Meu Agente",
      "workspace": "/home/lincoln/agents/meu-agente",
      "model": { "primary": "github-copilot/claude-sonnet-4.6" },
      "identity": { "name": "Meu Agente", "emoji": "🤖" }
    }]
  }
}
```

### Canal Discord para agente

```bash
python3 skills/agent-council/scripts/setup_channel.py \
  --name nome-canal \
  --context "Propósito do canal"
```

---

## 🗣️ sag — ElevenLabs TTS

**Quando usar:** Lincoln pediu áudio, resposta a mensagem de voz, histórias, momentos dramáticos

**Regra:** se Lincoln mandar áudio → responder em áudio (sempre)

```bash
sag -o /tmp/reply.mp3 "Texto aqui"
cp /tmp/reply.mp3 ~/.openclaw/workspace/reply.mp3
# Enviar via message tool (media:)
```

Tags expressivas: `[whispers]` `[shouts]` `[laughs]` `[sarcastic]` `[excited]` `[short pause]`

---

## 🎙️ openai-whisper-api — Transcrição de Áudio

**Quando usar:** áudio recebido pelo Telegram, transcrever arquivo de mídia

```bash
~/.npm-global/lib/node_modules/openclaw/skills/openai-whisper-api/scripts/transcribe.sh \
  /path/to/audio.ogg --out /tmp/transcript.txt
```

---

## 🌤️ weather — Clima

**Quando usar:** Lincoln pergunta sobre o tempo, vai sair, quer saber se chove

**Localização:** Petrópolis, RJ — lat=-22.505, lon=-43.174
**IMPORTANTE:** wttr.in não funciona nesse servidor — usar Open-Meteo direto

```bash
# Condições atuais
curl -s "https://api.open-meteo.com/v1/forecast?latitude=-22.505&longitude=-43.174&current=temperature_2m,precipitation,weathercode,windspeed_10m&timezone=America/Sao_Paulo"

# Previsão 7 dias
curl -s "https://api.open-meteo.com/v1/forecast?latitude=-22.505&longitude=-43.174&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=America/Sao_Paulo"
```

---

## 🔍 tavily — Busca Web

**Quando usar:** pesquisa aprofundada, notícias recentes, fact-checking, fontes autoritativas — melhor que `web_search` para research sério

```bash
~/.tavily-env/bin/python skills/tavily/scripts/tavily_search.py "query" \
  --depth advanced \   # basic (rápido) ou advanced (completo)
  --topic news \       # general ou news (últimos 7 dias)
  --max-results 5
```

---

## ✍️ ai-humanizer — Remove Padrões de IA

**Quando usar:** Lincoln pede pra humanizar texto, revisar escrita, fazer conteúdo soar natural

**Vocabulário proibido (Tier 1):** delve, tapestry, robust, seamless, leverage, paradigm, synergy, transformative, myriad, nestled, realm, embark, meticulous, groundbreaking

**Frases proibidas:** "In today's digital age", "plays a crucial role", "without further ado", "It is worth noting"

```bash
cd skills/ai-humanizer
node src/cli.js score < texto.txt          # Score 0-100
node src/cli.js analyze -f draft.md        # Análise completa
node src/cli.js humanize --autofix -f article.txt
```

---

## 📚 clawdbot-documentation-expert — Docs OpenClaw

**Quando usar:** dúvidas de configuração do OpenClaw, troubleshooting, novidades

```bash
skills/clawdbot-documentation-expert/scripts/search.sh <keyword>
skills/clawdbot-documentation-expert/scripts/fetch-doc.sh gateway/configuration
skills/clawdbot-documentation-expert/scripts/recent.sh 7
```

Snippets prontos: `skills/clawdbot-documentation-expert/snippets/common-configs.md`

---

## 🕸️ ontology — Grafo de Conhecimento

**Quando usar:** Lincoln pede pra "lembrar" algo estruturado, ligar entidades, planejar multi-step como grafo

**Storage:** `memory/ontology/graph.jsonl` (append-only)

```bash
python3 skills/ontology/scripts/ontology.py create --type Person --props '{"name":"X"}'
python3 skills/ontology/scripts/ontology.py query --type Task --where '{"status":"open"}'
python3 skills/ontology/scripts/ontology.py relate --from id1 --rel has_task --to id2
```

Tipos: `Person`, `Project`, `Task`, `Event`, `Location`, `Document`, `Note`

---

## 🔄 self-improving — Auto-Reflexão

**Quando usar:** automaticamente após tarefas complexas, quando Lincoln corrige, padrão repetido

- HOT memory: `~/self-improving/memory.md`
- Correções: `~/self-improving/corrections.md`
- Promoção para HOT após 3x o mesmo padrão

---

## 🧠 Skills de Comportamento

| Skill | Quando usar |
|-------|-------------|
| `decide` | Aprender padrões de decisão do Lincoln |
| `escalate` | Calibrar quando agir autonomamente vs perguntar |
| `learning` | Adaptar estilo de explicação |
| `memory` | Memória categorizada adicional |
