# SKILLS.md - Guia de Uso das Skills

Quando e como usar cada skill instalada. Atualizar sempre que uma skill nova for configurada.

---

## 🗣️ sag — ElevenLabs TTS

**Quando usar:** pedido de resposta em voz, áudio de histórias, respostas dramáticas, "fala isso pra mim"

**Voz padrão:** Brian (`nPczCjzI2devNBz1zQrb`) — Deep, Resonant

```bash
# Gera áudio e envia
sag -o /tmp/reply.mp3 "Texto aqui"
# Depois envia via message tool (media: /home/lincoln/.openclaw/workspace/reply.mp3)
```

Tags expressivas (eleven_v3):
- `[whispers]`, `[shouts]`, `[laughs]`, `[sarcastic]`, `[excited]`
- `[short pause]`, `[long pause]`

**Nota:** Copiar mp3 pra workspace antes de enviar (path `/tmp` bloqueado pelo message tool)

---

## 🎙️ openai-whisper-api — Transcrição de Áudio

**Quando usar:** usuário manda áudio/voz pelo Telegram, precisa transcrever arquivo de áudio ou vídeo

```bash
OPENAI_API_KEY="..." \
~/.npm-global/lib/node_modules/openclaw/skills/openai-whisper-api/scripts/transcribe.sh \
/path/to/audio.ogg --out /tmp/transcript.txt
```

Formatos: ogg, mp3, m4a, wav, webm

---

## ✍️ ai-humanizer — Remove Padrões de IA em Textos

**Quando usar:** Lincoln pede pra humanizar um texto, revisar escrita por padrões de IA, fazer conteúdo soar mais natural

**O que detecta (24 padrões):**
- Vocabulário tier 1: "delve", "tapestry", "robust", "seamless", "leverage", "paradigm"
- Frases genéricas: "In today's digital age", "plays a crucial role", "without further ado"
- Estrutura: em dashes excessivos, bold mecânico, listas inline-header
- Tom: sycofância ("Great question!"), hedging excessivo, conclusões genéricas

**Como usar:**
1. Receber o texto
2. Escanear os 24 padrões manualmente ou via script
3. Reescrever preservando o significado, adicionando especificidade e personalidade
4. Variar ritmo de frases — curtas e longas alternadas

```bash
# Score (0-100, maior = mais IA)
cd skills/ai-humanizer && node src/cli.js score < texto.txt

# Análise completa
node src/cli.js analyze -f draft.md

# Auto-fix
node src/cli.js humanize --autofix -f article.txt
```

**Regra always-on para mim:** evitar tier 1 vocab em todas as respostas. Ver SOUL.md.

---

## 📚 clawdbot-documentation-expert — Expert em Docs OpenClaw

**Quando usar:** dúvidas sobre configuração do OpenClaw, como configurar providers, troubleshooting, novidades na doc

**Fluxo:**
- "Como configuro X?" → buscar em `gateway/` ou `providers/`
- "Por que X não funciona?" → `troubleshooting`, `debugging`
- "O que é X?" → `concepts/`
- "Como automatizo X?" → `automation/`

```bash
# Buscar doc por keyword
skills/clawdbot-documentation-expert/scripts/search.sh <keyword>

# Pegar doc específica
skills/clawdbot-documentation-expert/scripts/fetch-doc.sh gateway/configuration

# Ver docs atualizadas recentemente
skills/clawdbot-documentation-expert/scripts/recent.sh 7

# Sitemap completo
skills/clawdbot-documentation-expert/scripts/sitemap.sh
```

Snippets prontos em: `skills/clawdbot-documentation-expert/snippets/common-configs.md`

---

## 🕸️ ontology — Grafo de Conhecimento Estruturado

**Quando usar:** Lincoln pede pra "lembrar" de algo estruturado (pessoas, projetos, tarefas, eventos), ligar entidades ("X trabalha em Y"), consultar o que sei sobre algo, planejar multi-step como grafo

**Storage:** `memory/ontology/graph.jsonl` (append-only)

Tipos principais: `Person`, `Project`, `Task`, `Event`, `Location`, `Document`, `Note`

```bash
# Criar entidade
python3 skills/ontology/scripts/ontology.py create --type Person --props '{"name":"Alice"}'

# Consultar
python3 skills/ontology/scripts/ontology.py query --type Task --where '{"status":"open"}'

# Relacionar
python3 skills/ontology/scripts/ontology.py relate --from proj_001 --rel has_task --to task_001

# Validar grafo
python3 skills/ontology/scripts/ontology.py validate
```

---

## 🌤️ weather — Clima e Previsão

**Quando usar:** Lincoln pergunta sobre o tempo, vai sair, quer saber se vai chover

**Localização padrão:** Petrópolis, Rio de Janeiro, Brasil
(Rua Angela Santana de Souza nº 164 — usar "Petropolis,RJ,Brazil" nas queries)

**Providers disponíveis:**
- `wttr.in` — primário (sem API key) — **atenção: pode ter timeout nesse servidor**
- `open-meteo.com` — fallback recomendado se wttr.in falhar

```bash
# Primário
curl -s "wttr.in/Petropolis,RJ,Brazil?format=3"

# Fallback Open-Meteo (coordenadas Petrópolis: lat=-22.505, lon=-43.174)
curl -s "https://api.open-meteo.com/v1/forecast?latitude=-22.505&longitude=-43.174&current=temperature_2m,precipitation,weathercode,windspeed_10m&timezone=America/Sao_Paulo"

# Previsão 3 dias
curl -s "wttr.in/Petropolis,RJ,Brazil"
```

**Não usar para:** dados históricos, alertas de emergência, análise climática

---

## 🔍 tavily — Busca Web Otimizada para IA

**Quando usar:** pesquisa web atual, notícias recentes, fact-checking, fontes autoritativas — melhor que web_search para pesquisa aprofundada

```bash
~/.tavily-env/bin/python skills/tavily/scripts/tavily_search.py "query" \
  --depth advanced \    # basic (rápido) ou advanced (completo)
  --topic news \        # general ou news (últimos 7 dias)
  --max-results 5
```

**vs web_search nativo:** Tavily tem geração de resposta IA + extração de conteúdo raw. web_search é mais rápido para queries simples.

---

## 🤖 self-improving — Auto-Reflexão e Aprendizado

**Quando usar:** automaticamente após tarefas complexas, quando Lincoln me corrige, quando identifico padrão repetido

- HOT memory: `~/self-improving/memory.md`
- Correções: `~/self-improving/corrections.md`
- Promoção pra HOT após 3x o mesmo padrão

---

## 🧠 Outras Skills Locais

| Skill | Quando usar |
|-------|-------------|
| `decide` | Aprender padrões de decisão do Lincoln |
| `escalate` | Calibrar quando agir autonomamente vs perguntar |
| `learning` | Adaptar estilo de ensino/explicação |
| `memory` | Memória categorizada adicional (além do MEMORY.md) |
