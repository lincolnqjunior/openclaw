#!/usr/bin/env node
/**
 * Playwright MCP Persistent Wrapper
 * 
 * Substituto do `npx @playwright/mcp` que usa launchPersistentContext
 * para manter cookies/sessões entre reinicializações do MCP.
 * 
 * userDataDir: /home/lincoln/.openclaw/playwright_data
 */

const { chromium } = require('playwright');
const { createConnection } = require('playwright/lib/mcp/index');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');

// contextGetter: função async que retorna browserContext persistente
const contextGetter = async () => {
  return await chromium.launchPersistentContext(
    '/home/lincoln/.openclaw/playwright_data',
    {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    }
  );
};

async function main() {
  const connection = await createConnection({}, contextGetter);
  const transport = new (require('@modelcontextprotocol/sdk/server/stdio.js').StdioServerTransport)();
  await connection.connect(transport);
  process.stderr.write('[playwright-mcp-persistent] Servidor iniciado com contexto persistente\n');
}

main().catch((err) => {
  process.stderr.write('[playwright-mcp-persistent] ERRO: ' + err.message + '\n');
  process.exit(1);
});
