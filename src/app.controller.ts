import { Controller } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { All, Next, Req, Res } from '@nestjs/common';
import { CrawlerService } from './crawler/crawler.service';

const exp = new RegExp('^/(?:[a-zA-Z0-9-_]+/)*(?:[a-zA-Z0-9-_]+)?/?$');

const proxy = createProxyMiddleware({
  changeOrigin: true,
  target: 'https://docs.nestjs.com',
  pathFilter: function (path) {
    if (path.includes('replace')) {
      console.log(path);
    }
    return !path.includes('replace');
  },
});

@Controller()
export class AppController {
  constructor(private readonly crawlerService: CrawlerService) {}
  @All('*')
  async get(@Req() req, @Res() res, @Next() next) {
    if (exp.test(req.url)) {
      res.status(200);
      const html = await this.crawlerService.create(
        'https://docs.nestjs.com' + req.url,
      );
      res.set('Content-type: text/html; charset=utf-8');
      res.send(html);
      res.end();
    } else {
      proxy(req, res, next);
    }
  }
}
