import { Injectable } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import * as WebSocket from 'ws';
import { KrakenLevel, KrakenOrderbookResponse } from './kraken.types';
import { BaseOrderbookService } from '../orderbook.service';
import { OrderbookLevel } from '../orderbook.types';

@Injectable()
@WebSocketGateway()
export class KrakenOrderbookService extends BaseOrderbookService {
  constructor() {
    const name = 'Kraken';
    const wssUrl = 'wss://ws.kraken.com/';
    const subscriptionMessage = {
      event: 'subscribe',
      pair: ['BTC/USDT'],
      subscription: {
        name: 'book',
      },
    };
    super(name, wssUrl, subscriptionMessage);
  }
  protected async handleData(data: WebSocket.Data) {
    const parsedData: KrakenOrderbookResponse = JSON.parse(data.toString());
    const orderbook = parsedData[1];

    if (orderbook?.as) {
      this.setAsks(this.calcUpdatedLevels(this.asks, orderbook.as));
    }
    if (orderbook?.a) {
      this.setAsks(this.calcUpdatedLevels(this.asks, orderbook.a));
    }
    if (orderbook?.bs) {
      this.setBids(this.calcUpdatedLevels(this.bids, orderbook.bs));
    }
    if (orderbook?.b) {
      const updatedBids = this.calcUpdatedLevels(
        structuredClone(this.bids).reverse(),
        structuredClone(orderbook.b).reverse(),
      );
      this.setBids(updatedBids.reverse());
    }
  }

  private calcUpdatedLevels(
    _currentLevels: OrderbookLevel[],
    levels: KrakenLevel[],
  ): OrderbookLevel[] {
    let currentLevels = structuredClone(_currentLevels);
    // console.log('rows: ' + levels.length);
    if (currentLevels.length === 0) {
      return levels.map((level) => {
        return [Number(level[0]), Number(level[1])];
      });
    }

    for (const level of levels) {
      const price = Number(level[0]);
      const volume = Number(level[1]);
      const isDelete = volume === 0;

      for (let index = 0; index < currentLevels.length; index++) {
        const currentPrice = Number(currentLevels[index][0]);

        // delete level
        if (isDelete && currentPrice === price) {
          // console.log('Delete', currentPrice);
          currentLevels.splice(index, 1);
          break;
        }

        // update level
        const isUpdate = currentPrice === price;
        if (isUpdate) {
          // console.log('Update', price);
          currentLevels[index] = [price, volume];
          break;
        }

        // new level
        // append
        const isLastIndex = index === currentLevels.length - 1;
        if (isLastIndex) {
          // console.log('Append', price);
          currentLevels.push([price, volume]);
          break;
        }

        // insert
        if (price < Number(currentLevels[index + 1][0])) {
          // console.log('Insert', price);
          currentLevels[index] = [price, volume];
          break;
        }
      }
    }

    return currentLevels;
  }
}
