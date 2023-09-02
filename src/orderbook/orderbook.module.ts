import { Module } from '@nestjs/common';
import { OrderbookController } from './orderbook.controller';
import { BinanceOrderbookService } from './services/binance/binance.service';
import { KrakenOrderbookService } from './services/kraken/kraken.service';
import { HuobiOrderbookService } from './services/huobi/huobi.service';
import { GzipService } from '../utils/gzip.service';

@Module({
  imports: [],
  controllers: [OrderbookController],
  providers: [
    KrakenOrderbookService,
    HuobiOrderbookService,
    BinanceOrderbookService,
    GzipService,
  ],
})
export class OrderbookModule {}
