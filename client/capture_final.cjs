const { chromium } = require('playwright');
const path = require('path');

async function captureScreenshots() {
    const artifactDir = "C:\\Users\\test\\.gemini\\antigravity\\brain\\9745226d-9f9b-48fc-bf5a-8fd7a6d11a20";
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    console.log("Navigating to Home...");
    await page.goto('http://localhost:5173/');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(artifactDir, 'home_hero_redesign_light.png') });

    // Toggle dark mode
    await page.click('button[aria-label="Dark Mode"]');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(artifactDir, 'home_hero_redesign_dark.png') });

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(artifactDir, 'home_footer_redesign_dark.png') });

    // Toggle light mode for footer
    await page.click('button[aria-label="Light Mode"]');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(artifactDir, 'home_footer_redesign_light.png') });

    console.log("Navigating to Apply page to verify fix...");
    await page.goto('http://localhost:5173/apply');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(artifactDir, 'apply_page_fixed.png') });

    // Navigate to Registrar Dashboard to verify fix
    console.log("Navigating to Login then Registrar Dashboard...");
    await page.goto('http://localhost:5173/login');
    await page.waitForTimeout(1500);
    await page.click('button:has-text("Registrar")');
    await page.waitForTimeout(500);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(artifactDir, 'registrar_dashboard_fixed.png') });

    await browser.close();
    console.log("Screenshots captured successfully.");
}

captureScreenshots().catch(console.error);
