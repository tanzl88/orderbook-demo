import { Controller, Get } from '@nestjs/common';
import { OrderbookService } from './orderbook.service';

@Controller('orderbook')
export class OrderbookController {
  constructor(private orderbookService: OrderbookService) {}

  @Get('midprice')
  getMidPrice() {
    return this.orderbookService.getMidPrice();
  }

  @Get('levels')
  getOrderbook() {
    return this.orderbookService.getOrderbook();
  }
}
