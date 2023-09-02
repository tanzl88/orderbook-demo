import { KrakenOrderbookService } from './kraken.service'; // Import your function
import { OrderbookLevel } from '../orderbook.types';

// Define the KrakenLevel interface
type KrakenLevel = [
  string, // price
  string, // volume
  string, // timestamp
  string, // update type
];

describe('KrakenOrderbookService', () => {
  let service: KrakenOrderbookService;

  beforeEach(() => {
    service = new KrakenOrderbookService();
  });

  it('should return levels when _currentLevels is empty', () => {
    const _currentLevels: OrderbookLevel[] = [];
    const levels: KrakenLevel[] = [
      ['100', '10', 'timestamp', 'update'],
      ['101', '20', 'timestamp', 'update'],
      ['102', '30', 'timestamp', 'update'],
    ];
    const result = service['calcUpdatedLevels'](_currentLevels, levels);
    expect(result).toEqual([
      [100, 10],
      [101, 20],
      [102, 30],
    ]);
  });

  it('should update levels when there are updates', () => {
    const _currentLevels: OrderbookLevel[] = [
      [100, 10],
      [101, 10],
      [102, 20],
    ];
    const levels: KrakenLevel[] = [
      ['101', '25', 'timestamp', 'update'],
      ['102', '35', 'timestamp', 'update'],
    ];
    const result = service['calcUpdatedLevels'](_currentLevels, levels);
    const expected: OrderbookLevel[] = [
      [100, 10],
      [101, 25],
      [102, 35],
    ];
    expect(result).toEqual(expected);
  });

  it('should delete levels when there are deletes', () => {
    const _currentLevels: OrderbookLevel[] = [
      [100, 10],
      [101, 10],
      [102, 20],
    ];
    const levels: KrakenLevel[] = [['101', '0', 'timestamp', 'delete']];
    const result = service['calcUpdatedLevels'](_currentLevels, levels);
    const expected: OrderbookLevel[] = [
      [100, 10],
      [102, 20],
    ];
    expect(result).toEqual(expected);
  });

  it('should insert levels when there are inserts', () => {
    const _currentLevels: OrderbookLevel[] = [
      [100, 10],
      [102, 30],
    ];
    const levels: KrakenLevel[] = [['101', '20', 'timestamp', 'insert']];
    const result = service['calcUpdatedLevels'](_currentLevels, levels);
    const expected: OrderbookLevel[] = [
      [100, 10],
      [101, 20],
      [102, 30],
    ];
    expect(result).toEqual(expected);
  });

  it('should handle updates, deletes, and inserts', () => {
    const _currentLevels: OrderbookLevel[] = [
      [100, 10],
      [101, 20],
      [102, 30],
    ];
    const levels: KrakenLevel[] = [
      ['101', '0', 'timestamp', 'delete'],
      ['102', '35', 'timestamp', 'update'],
      ['103', '40', 'timestamp', 'insert'],
    ];
    const result = service['calcUpdatedLevels'](_currentLevels, levels);
    const expected: OrderbookLevel[] = [
      [100, 10],
      [102, 35],
      [103, 40],
    ];
    expect(result).toEqual(expected);
  });
});
