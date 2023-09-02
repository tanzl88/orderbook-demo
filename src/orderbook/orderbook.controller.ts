import { Controller, Get } from '@nestjs/common';
import { KrakenOrderbookService } from './services/kraken/kraken.service';
import { HuobiOrderbookService } from './services/huobi/huobi.service';
import { BinanceOrderbookService } from './services/binance/binance.service';

@Controller('orderbook')
export class OrderbookController {
  constructor(
    private krakenOrderbookService: KrakenOrderbookService,
    private huobiOrderbookService: HuobiOrderbookService,
    private binanceOrderbookService: BinanceOrderbookService,
  ) {}

  @Get('midprice')
  getMidPrice() {
    const sources = {
      kraken: this.krakenOrderbookService.getMidPrice(),
      huobi: this.huobiOrderbookService.getMidPrice(),
      binance: this.binanceOrderbookService.getMidPrice(),
    };
    const midPrices = Object.values(sources).filter((price) => price !== null);
    const sum = midPrices.reduce((a, b) => a + b, 0);
    const average = sum / midPrices.length;

    return {
      average,
      sources,
    };
  }

  @Get('levels')
  getLevels() {
    return {
      kraken: this.krakenOrderbookService.getLevels(),
      huobi: this.huobiOrderbookService.getLevels(),
      binance: this.binanceOrderbookService.getLevels(),
    };
  }
}
