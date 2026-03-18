const { chromium } = require('playwright');
const path = require('path');

async function checkConsoleErrors() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log(`BROWSER ERROR: ${msg.text()}`);
        }
    });

    page.on('pageerror', exception => {
        console.log(`UNCAUGHT EXCEPTION: ${exception}`);
    });

    console.log("Checking Apply page...");
    await page.goto('http://localhost:5173/apply');
    await page.waitForTimeout(3000);

    console.log("Checking Login...");
    await page.goto('http://localhost:5173/login');
    await page.waitForTimeout(2000);
    await page.click('button:has-text("Registrar")');
    await page.waitForTimeout(500);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(4000);

    console.log("Checking completed.");
    await browser.close();
}

checkConsoleErrors().catch(console.error);
