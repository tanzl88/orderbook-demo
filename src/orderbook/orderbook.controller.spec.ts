import { Test, TestingModule } from '@nestjs/testing';
import { OrderbookController } from './orderbook.controller';
import { KrakenOrderbookService } from './services/kraken/kraken.service';
import { HuobiOrderbookService } from './services/huobi/huobi.service';
import { BinanceOrderbookService } from './services/binance/binance.service';
import { GzipService } from '../utils/gzip.service';

describe('OrderbookController', () => {
  let orderbookController: OrderbookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderbookController],
      providers: [
        KrakenOrderbookService,
        HuobiOrderbookService,
        BinanceOrderbookService,
        GzipService,
      ],
    }).compile();

    orderbookController = module.get<OrderbookController>(OrderbookController);
  });

  it('should calculate the average midprice correctly', () => {
    // Mock the getMidPrice method for each service
    const krakenMidPrice = 100;
    const huobiMidPrice = 120;
    const binanceMidPrice = 110;
    jest
      .spyOn(orderbookController.krakenOrderbookService, 'getMidPrice')
      .mockReturnValue(krakenMidPrice);
    jest
      .spyOn(orderbookController.huobiOrderbookService, 'getMidPrice')
      .mockReturnValue(huobiMidPrice);
    jest
      .spyOn(orderbookController.binanceOrderbookService, 'getMidPrice')
      .mockReturnValue(binanceMidPrice);

    const result = orderbookController.getMidPrice();

    expect(result).toEqual({
      average: (krakenMidPrice + huobiMidPrice + binanceMidPrice) / 3,
      sources: {
        kraken: krakenMidPrice,
        huobi: huobiMidPrice,
        binance: binanceMidPrice,
      },
    });
  });

  it('should remove null values if any source has a null midprice', () => {
    // Mock one of the services to return null
    const krakenMidPrice = 100;
    const huobiMidPrice = null;
    const binanceMidPrice = 110;

    jest
      .spyOn(orderbookController.krakenOrderbookService, 'getMidPrice')
      .mockReturnValue(krakenMidPrice);
    jest
      .spyOn(orderbookController.huobiOrderbookService, 'getMidPrice')
      .mockReturnValue(huobiMidPrice);
    jest
      .spyOn(orderbookController.binanceOrderbookService, 'getMidPrice')
      .mockReturnValue(binanceMidPrice);

    const result = orderbookController.getMidPrice();

    expect(result).toEqual({
      average: (krakenMidPrice + binanceMidPrice) / 2,
      sources: {
        kraken: krakenMidPrice,
        huobi: huobiMidPrice,
        binance: binanceMidPrice,
      },
    });
  });

  it('should return order book levels from all sources', () => {
    // Mock the getOrderbook method for each service
    const krakenLevels = {
      a: [
        [10000, 1],
        [20000, 2],
      ],
      b: [
        [20000, 2],
        [10000, 1],
      ],
    };
    const huobiLevels = {
      a: [
        [30000, 3],
        [40000, 4],
      ],
      b: [
        [40000, 4],
        [30000, 3],
      ],
    };
    const binanceLevels = {
      a: [
        [50000, 5],
        [60000, 6],
      ],
      b: [
        [50000, 5],
        [60000, 6],
      ],
    };

    jest
      .spyOn(orderbookController.krakenOrderbookService, 'getOrderbook')
      .mockReturnValue(krakenLevels);
    jest
      .spyOn(orderbookController.huobiOrderbookService, 'getOrderbook')
      .mockReturnValue(huobiLevels);
    jest
      .spyOn(orderbookController.binanceOrderbookService, 'getOrderbook')
      .mockReturnValue(binanceLevels);

    const result = orderbookController.getOrderbook();

    expect(result).toEqual({
      kraken: krakenLevels,
      huobi: huobiLevels,
      binance: binanceLevels,
    });
  });
});
