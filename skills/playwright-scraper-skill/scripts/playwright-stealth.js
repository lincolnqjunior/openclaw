#!/usr/bin/env node
/**
 * Playwright Stealth Scraper
 * Use: Cloudflare-protected or anti-bot sites
 * Speed: medium (5-20 seconds)
 *
 * Usage: node playwright-stealth.js <URL>
 * Env: HEADLESS=false, WAIT_TIME=5000, SCREENSHOT_PATH=..., SAVE_HTML=true, USER_AGENT=...
 */

const { chromium } = require('playwright');
const fs = require('fs');

const url = process.argv[2];
const waitTime = parseInt(process.env.WAIT_TIME || '5000');
const headless = process.env.HEADLESS !== 'false';
const screenshotPath = process.env.SCREENSHOT_PATH || `./screenshot-${Date.now()}.png`;
const saveHtml = process.env.SAVE_HTML === 'true';
const userAgent = process.env.USER_AGENT ||
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

if (!url) {
    console.error('Usage: node playwright-stealth.js <URL>');
    process.exit(1);
}

(async () => {
    const startTime = Date.now();

    const browser = await chromium.launch({
        headless,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled',
            '--disable-features=IsolateOrigins,site-per-process',
        ],
    });

    const context = await browser.newContext({
        userAgent,
        locale: 'en-US',
        viewport: { width: 375, height: 812 },
        extraHTTPHeaders: {
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        },
    });

    // Hide automation markers
    await context.addInitScript(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
        window.chrome = { runtime: {} };
        const originalQuery = window.navigator.permissions.query;
        window.navigator.permissions.query = (parameters) => (
            parameters.name === 'notifications' ?
                Promise.resolve({ state: Notification.permission }) :
                originalQuery(parameters)
        );
    });

    const page = await context.newPage();

    let httpStatus = null;
    try {
        const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        httpStatus = response.status();
    } catch (error) {
        console.error('Navigation error:', error.message);
    }

    await page.waitForTimeout(waitTime);

    // Check for Cloudflare
    const cloudflare = await page.evaluate(() =>
        document.body.innerText.includes('Checking your browser') ||
        document.body.innerText.includes('Just a moment') ||
        !!document.querySelector('iframe[src*="challenges.cloudflare.com"]')
    );

    if (cloudflare) {
        await page.waitForTimeout(10000);
    }

    const result = await page.evaluate(() => ({
        title: document.title,
        url: window.location.href,
        content: document.body.innerText.substring(0, 5000),
        htmlLength: document.documentElement.outerHTML.length,
    }));

    result.httpStatus = httpStatus;
    result.cloudflare = cloudflare;

    try {
        await page.screenshot({ path: screenshotPath, fullPage: false, timeout: 10000 });
        result.screenshot = screenshotPath;
    } catch (e) {
        result.screenshot = null;
    }

    if (saveHtml) {
        const htmlPath = screenshotPath.replace(/\.[^.]+$/, '.html');
        fs.writeFileSync(htmlPath, await page.content());
        result.htmlFile = htmlPath;
    }

    result.elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(JSON.stringify(result, null, 2));
    await browser.close();
})();
