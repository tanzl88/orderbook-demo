import { Module } from '@nestjs/common';
import { OrderbookController } from './orderbook.controller';
import { BinanceOrderbookService } from './services/binance/binance.service';
import { KrakenOrderbookService } from './services/kraken/kraken.service';
import { HuobiOrderbookService } from './services/huobi/huobi.service';
import { OrderbookService } from './orderbook.service';
import { OrderbookGateway } from './orderbook.gateway';
import { GzipService } from '../utils/gzip.service';

@Module({
  imports: [],
  controllers: [OrderbookController],
  providers: [
    OrderbookGateway,
    OrderbookService,
    KrakenOrderbookService,
    HuobiOrderbookService,
    BinanceOrderbookService,
    GzipService,
  ],
})
export class OrderbookModule {}
