#!/usr/bin/env node
/**
 * Playwright Simple Scraper
 * Use: regular dynamic websites, no anti-bot protection
 * Speed: fast (3-5 seconds)
 *
 * Usage: node playwright-simple.js <URL>
 * Env: WAIT_TIME=3000, SCREENSHOT_PATH=..., HEADLESS=false
 */

const { chromium } = require('playwright');

const url = process.argv[2];
const waitTime = parseInt(process.env.WAIT_TIME || '3000');
const screenshotPath = process.env.SCREENSHOT_PATH;

if (!url) {
    console.error('Usage: node playwright-simple.js <URL>');
    process.exit(1);
}

(async () => {
    const startTime = Date.now();

    const browser = await chromium.launch({
        headless: process.env.HEADLESS !== 'false'
    });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(waitTime);

    const result = await page.evaluate(() => ({
        title: document.title,
        url: window.location.href,
        content: document.body.innerText.substring(0, 5000),
        metaDescription: document.querySelector('meta[name="description"]')?.content || '',
    }));

    if (screenshotPath) {
        await page.screenshot({ path: screenshotPath });
        result.screenshot = screenshotPath;
    }

    result.elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(JSON.stringify(result, null, 2));
    await browser.close();
})();
