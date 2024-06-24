import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class CrawlerService {
  async create(url: string) {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
      executablePath:
        process.env.NODE_ENV && process.env.NODE_ENV !== 'development'
          ? '/usr/bin/chromium-browser'
          : undefined,
      ignoreHTTPSErrors: true,
      defaultViewport: null,
    });

    const page = await browser.newPage();
    await page.goto(url);

    await page.evaluate(() => {
      const script = document.createElement('script');
      script.src = '/replace.js';
      script.type = 'module';
      document.body.append(script);
      return document.body.innerHTML;
    });

    const data = await page.content();
    await browser.close();
    return data;
  }
}
