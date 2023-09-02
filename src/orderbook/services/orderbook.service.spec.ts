import { BaseOrderbookService } from './orderbook.service';

// Mock WebSocket
const mockWebSocket = {
  on: jest.fn(),
  send: jest.fn(),
  close: jest.fn(),
};

// Mock WebSocket constructor
jest.mock('ws', () => {
  return jest.fn(() => mockWebSocket);
});

describe('BaseOrderbookService', () => {
  let service: BaseOrderbookService;

  beforeEach(() => {
    service = new BaseOrderbookService('Test', 'ws://test-url', {});
  });

  it('should create an instance', () => {
    expect(service).toBeDefined();
  });

  it('should get the midprice', () => {
    service.setAsks([[101, 1]]);
    service.setBids([[99, 2]]);
    const midprice = service.getMidPrice();
    expect(midprice).toEqual(100);
  });

  it('should return null if either asks or bids is empty', () => {
    service.setAsks([]);
    service.setBids([[99, 2]]);
    const midprice = service.getMidPrice();
    expect(midprice).toBeNull();
  });

  it('should get the orderbook', () => {
    const asks = [
      [101, 1],
      [102, 2],
    ];
    const bids = [
      [99, 2],
      [98, 1],
    ];
    service.setAsks(asks);
    service.setBids(bids);
    const orderbook = service.getOrderbook();
    expect(orderbook).toEqual({ a: asks, b: bids });
  });

  it('should return false for valid increasing levels', () => {
    const validLevels = [
      [1, 1],
      [2, 2],
      [3, 3],
    ];

    expect(service['isError'](validLevels, true)).toEqual(false);
  });

  it('should return false for valid decreasing levels', () => {
    const validLevels = [
      [3, 3],
      [2, 2],
      [1, 1],
    ];

    expect(service['isError'](validLevels, false)).toEqual(false);
  });

  it('should return true for invalid increasing levels', () => {
    const invalidLevels = [
      [1, 1],
      [3, 2],
      [2, 3],
    ];

    expect(service['isError'](invalidLevels, true)).toEqual(true);
  });

  it('should return true for invalid decreasing levels', () => {
    const invalidLevels = [
      [3, 3],
      [1, 2],
      [2, 1],
    ];

    expect(service['isError'](invalidLevels, false)).toEqual(true);
  });
});
