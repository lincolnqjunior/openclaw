---
name: playwright-scraper-skill
version: 1.2.0
description: Playwright CLI scraper with stealth anti-bot support
---

## When to Use

| Target | Anti-Bot | Method |
|--------|----------|--------|
| Static HTML | None | `web_fetch` tool (built-in) |
| Dynamic / JS-rendered | Low | `playwright-simple.js` |
| Cloudflare / 403 | High | `playwright-stealth.js` |

## Usage

```bash
# Simple (fast, no anti-bot)
node skills/playwright-scraper-skill/scripts/playwright-simple.js "https://example.com"

# Stealth (Cloudflare/anti-bot)
node skills/playwright-scraper-skill/scripts/playwright-stealth.js "https://example.com"

# Env options
WAIT_TIME=8000 SAVE_HTML=true SCREENSHOT_PATH=/tmp/shot.png node scripts/playwright-stealth.js <URL>
HEADLESS=false node scripts/playwright-stealth.js <URL>   # show browser
```

## Output (JSON)

Both scripts print JSON to stdout:
```json
{
  "title": "Page Title",
  "url": "https://...",
  "content": "text content (up to 5000 chars)",
  "elapsedSeconds": "3.45",
  "screenshot": "/path/to/screenshot.png"
}
```

## Decision Flow

1. Try `web_fetch` first — fastest, zero overhead
2. If JS-rendered or content missing → `playwright-simple.js`
3. If 403 / Cloudflare challenge → `playwright-stealth.js`
4. If still blocked → increase `WAIT_TIME`, try `HEADLESS=false`
