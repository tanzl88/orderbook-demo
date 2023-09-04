import { Test, TestingModule } from '@nestjs/testing';
import { OrderbookService } from './orderbook.service';
import { KrakenOrderbookService } from './services/kraken/kraken.service';
import { HuobiOrderbookService } from './services/huobi/huobi.service';
import { BinanceOrderbookService } from './services/binance/binance.service';
import { GzipService } from '../utils/gzip.service';

describe('OrderbookController', () => {
  let orderbookService: OrderbookService;
  let krakenOrderbookService: KrakenOrderbookService;
  let huobiOrderbookService: HuobiOrderbookService;
  let binanceOrderbookService: BinanceOrderbookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderbookService,
        KrakenOrderbookService,
        HuobiOrderbookService,
        BinanceOrderbookService,
        GzipService,
      ],
    }).compile();

    orderbookService = module.get<OrderbookService>(OrderbookService);
    krakenOrderbookService = module.get<KrakenOrderbookService>(
      KrakenOrderbookService,
    );
    huobiOrderbookService = module.get<HuobiOrderbookService>(
      HuobiOrderbookService,
    );
    binanceOrderbookService = module.get<BinanceOrderbookService>(
      BinanceOrderbookService,
    );
  });

  it('should calculate the average midprice correctly', () => {
    // Mock the getMidPrice method for each service
    const krakenMidPrice = 100;
    const huobiMidPrice = 120;
    const binanceMidPrice = 110;
    jest
      .spyOn(krakenOrderbookService, 'getMidPrice')
      .mockReturnValue(krakenMidPrice);
    jest
      .spyOn(huobiOrderbookService, 'getMidPrice')
      .mockReturnValue(huobiMidPrice);
    jest
      .spyOn(binanceOrderbookService, 'getMidPrice')
      .mockReturnValue(binanceMidPrice);

    const result = orderbookService.getMidPrice();

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
      .spyOn(krakenOrderbookService, 'getMidPrice')
      .mockReturnValue(krakenMidPrice);
    jest
      .spyOn(huobiOrderbookService, 'getMidPrice')
      .mockReturnValue(huobiMidPrice);
    jest
      .spyOn(binanceOrderbookService, 'getMidPrice')
      .mockReturnValue(binanceMidPrice);

    const result = orderbookService.getMidPrice();

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
      .spyOn(krakenOrderbookService, 'getOrderbook')
      .mockReturnValue(krakenLevels);
    jest
      .spyOn(huobiOrderbookService, 'getOrderbook')
      .mockReturnValue(huobiLevels);
    jest
      .spyOn(binanceOrderbookService, 'getOrderbook')
      .mockReturnValue(binanceLevels);

    const result = orderbookService.getOrderbook();

    expect(result).toEqual({
      kraken: krakenLevels,
      huobi: huobiLevels,
      binance: binanceLevels,
    });
  });
});
