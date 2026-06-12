import puppeteerCore from "puppeteer-core";
import chromium from "@sparticuz/chromium";

/**
 * Gera um PDF A4 a partir de HTML.
 * Em produção (Vercel/serverless) usa o Chromium do @sparticuz/chromium;
 * em desenvolvimento usa o Chrome baixado pelo pacote `puppeteer`.
 */
export async function htmlParaPdf(html: string): Promise<Buffer> {
  const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

  const browser = isServerless
    ? await puppeteerCore.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      })
    : await (await import("puppeteer")).default.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "2cm", bottom: "2cm", left: "2cm", right: "2cm" },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
