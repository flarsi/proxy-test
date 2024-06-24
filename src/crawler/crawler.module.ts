import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler.service';

@Module({
  imports: [],
  providers: [CrawlerService],
  exports: [CrawlerService],
})
export class CrawlerModule {}
