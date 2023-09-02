import { Injectable } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import * as WebSocket from 'ws';
import { HuobiOrderbookResponse } from './huobi.types';
import * as process from 'process';
import { BaseOrderbookService } from '../orderbook.service';
import { GzipService } from '../../../utils/gzip.service';

@Injectable()
@WebSocketGateway()
export class HuobiOrderbookService extends BaseOrderbookService {
  constructor(private gzipService: GzipService) {
    const name = 'Huobi';
    const wssUrl = 'wss://api.huobi.pro/ws';
    const subscriptionMessage = {
      sub: 'market.btcusdt.depth.step0',
    };
    super(name, wssUrl, subscriptionMessage);
  }

  protected async handleData(data: WebSocket.Data) {
    const unzipped = await this.gzipService.unzip(data as string);
    const parsedData: HuobiOrderbookResponse = JSON.parse(unzipped);

    if (parsedData?.tick?.asks) {
      // console.log(parsedData.tick.asks);
      this.asks = parsedData.tick.asks;
    }
    if (parsedData?.tick?.bids) {
      // console.log(parsedData.tick.bids);
      this.bids = parsedData.tick.bids;
    }
  }
}
