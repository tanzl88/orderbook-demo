import { Injectable } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import * as WebSocket from 'ws';
import { KrakenLevel, KrakenOrderbookResponse } from './kraken.types';
import { BaseOrderbookService } from '../orderbook.service';

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
      this.updateAsks(orderbook.as);
    }
    if (orderbook?.a) {
      this.updateAsks(orderbook.a);
    }
    if (orderbook?.bs) {
      this.updateBids(orderbook.bs);
    }
    if (orderbook?.b) {
      this.updateBids(orderbook.b);
    }

    if (orderbook?.as || orderbook?.a) {
      // console.log('OB', this.asks);
      // check
      // let checkOk = true;
      // for (let index = 0; index < this.asks.length - 2; index++) {
      //   if (this.asks[index] >= this.asks[index + 1]) {
      //     checkOk = false;
      //   }
      // }
      // console.log('Orderbook: ' + checkOk);
    }
  }

  private updateAsks(levels: KrakenLevel[]) {
    // console.log('rows: ' + levels.length);
    if (this.asks.length === 0) {
      this.asks = levels.map((level) => {
        return [Number(level[0]), Number(level[1])];
      });
      return null;
    }

    for (const level of levels) {
      const price = Number(level[0]);
      const volume = Number(level[1]);
      const isDelete = volume === 0;

      for (let index = 0; index < this.asks.length; index++) {
        const currentPrice = Number(this.asks[index][0]);

        // delete level
        if (isDelete && currentPrice === price) {
          // console.log('Delete', currentPrice);
          this.asks.splice(index, 1);
          break;
        }

        // update level
        const isUpdate = currentPrice === price;
        if (isUpdate) {
          // console.log('Update', price);
          this.asks[index] = [price, volume];
          break;
        }

        // new level
        // append
        const isLastIndex = index === this.asks.length - 1;
        if (isLastIndex) {
          // console.log('Append', price);
          this.asks.push([price, volume]);
          break;
        }

        // insert
        if (price < Number(this.asks[index + 1][0])) {
          // console.log('Insert', price);
          this.asks[index] = [price, volume];
          break;
        }
      }
    }
  }

  private updateBids(levels: KrakenLevel[]) {
    // console.log('rows: ' + levels.length);
    if (this.bids.length === 0) {
      this.bids = levels.map((level) => {
        return [Number(level[0]), Number(level[1])];
      });
      return null;
    }

    for (const level of levels) {
      const price = Number(level[0]);
      const volume = Number(level[1]);
      const isDelete = volume === 0;

      for (let index = 0; index < this.bids.length; index++) {
        const currentPrice = Number(this.bids[index][0]);

        // delete level
        if (isDelete && currentPrice === price) {
          // console.log('Delete', currentPrice);
          this.bids.splice(index, 1);
          break;
        }

        // update level
        const isUpdate = currentPrice === price;
        if (isUpdate) {
          // console.log('Update', price);
          this.bids[index] = [price, volume];
          break;
        }

        // new level
        // append
        const isLastIndex = index === this.bids.length - 1;
        if (isLastIndex) {
          // console.log('Append', price);
          this.bids.push([price, volume]);
          break;
        }

        // insert
        if (price < Number(this.bids[index + 1][0])) {
          // console.log('Insert', price);
          this.bids[index] = [price, volume];
          break;
        }
      }
    }
  }
}
