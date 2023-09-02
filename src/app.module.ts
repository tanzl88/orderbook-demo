import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderbookModule } from './orderbook/orderbook.module';

@Module({
  imports: [OrderbookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
