const { chromium } = require('playwright');
const path = require('path');

async function captureScreenshots() {
    const artifactDir = "C:\\Users\\test\\.gemini\\antigravity\\brain\\9745226d-9f9b-48fc-bf5a-8fd7a6d11a20";
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    console.log("Navigating to login...");
    await page.goto('http://localhost:5173/login');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(artifactDir, 'login_ui_redesign_final.png') });
    console.log("Captured login page.");

    console.log("Logging in as Registrar...");
    // Click the registrar demo button
    await page.click('button:has-text("Registrar")');
    await page.waitForTimeout(1000);
    // Click sign in
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000); // Wait for redirect and load

    console.log("Dashboard loaded, capturing index...");
    await page.screenshot({ path: path.join(artifactDir, 'registrar_dashboard_index_final.png') });

    // Click Departments tab (using role tab to be safer)
    console.log("Clicking Departments tab...");
    await page.click('div[role="tab"]:has-text("Departments")');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(artifactDir, 'registrar_dashboard_departments_final.png') });

    // Add a Department to test Departments page
    console.log("Adding an department...");
    await page.click('button:has-text("Add Department")');
    await page.waitForTimeout(1000);
    await page.fill('input[name="name"]', 'Artificial Intelligence'); // using labels might be tricky, let's use DOM selectors if possible or just use the UI visually
    // Actually, just click cancel to show the dialog
    await page.screenshot({ path: path.join(artifactDir, 'registrar_add_department_dialog.png') });
    await page.click('button:has-text("Cancel")');
    await page.waitForTimeout(1000);

    // Click Admissions Posts tab
    console.log("Clicking Admissions Posts tab...");
    await page.click('div[role="tab"]:has-text("Admissions Posts")');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(artifactDir, 'registrar_dashboard_admissions_final.png') });

    console.log("Navigating to Apply page...");
    await page.goto('http://localhost:5173/apply');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(artifactDir, 'apply_page_with_admissions_post_final.png') });

    await browser.close();
    console.log("Screenshots captured successfully.");
}

captureScreenshots().catch(console.error);
