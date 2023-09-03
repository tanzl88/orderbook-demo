import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderbookModule } from './orderbook/orderbook.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [OrderbookModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
