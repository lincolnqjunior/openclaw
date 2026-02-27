# TODO: notebooklm-mcp — Autenticação Pendente

## Status
🔴 **NÃO CONCLUÍDO** — MCP instalado e infraestrutura pronta, mas autenticação não finalizada

## O que já foi feito
- [x] Google Chrome instalado (`/opt/google/chrome/chrome`)
- [x] Xvfb + x11vnc configurados (`scripts/start-display.sh`)
- [x] mcporter config com notebooklm, context7 e time (`config/mcporter.json`)
- [x] `time` MCP funcionando ✅
- [x] `get_health` retorna `authenticated: true` após setup_auth
- [x] Timeouts aumentados no source do MCP (10s → 45s)
- [x] Fallback PT-BR adicionado (`textarea[aria-label="Campo de consultas"]`)

## Problema atual
O `state.json` gerado pelo `setup_auth` só contém cookies de `accounts.google.com` — não do `notebooklm.google.com`. Resultado: Playwright carrega o notebook mas redireciona para login, sem nunca chegar ao campo de chat.

## Próximos passos para retomar
1. Garante Xvfb + x11vnc: `~/.openclaw/workspace/scripts/start-display.sh`
2. Tunelar VNC: `ssh -L 5900:127.0.0.1:5900 lincoln@ip -N`
3. Conectar TigerVNC em localhost:5900
4. Rodar:
   ```bash
   cd ~/.openclaw/workspace
   DISPLAY=:99 MCPORTER_CALL_TIMEOUT=600000 \
     mcporter call notebooklm.setup_auth show_browser=true --timeout 600000
   ```
5. **No VNC:** fazer login → navegar manualmente até o notebook → esperar campo de perguntas aparecer
6. MCP salva o state automaticamente quando detecta sucesso
7. Testar: `mcporter call notebooklm.ask_question question="teste" notebook_url="https://notebooklm.google.com/notebook/57676adc-9429-498f-a57a-351640960941" --timeout 120000`

## Diagnóstico adicional (se ainda falhar)
- Inspecionar seletor real via CDP: `node /tmp/inspect-notebooklm.js` (após state válido)
- Verificar `textarea` existente na página — MCP procura `textarea.query-box-input`
- Source modificado em: `/home/lincoln/.npm/_npx/16baa19dd5d31de6/node_modules/notebooklm-mcp/dist/session/browser-session.js`
