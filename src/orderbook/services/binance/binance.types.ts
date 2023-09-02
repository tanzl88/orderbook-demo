export type BinanceLevel = [
  string, // price
  string, // volume
];
export type BinanceOrderbookResponse = {
  e: string; // event
  E: number;
  s: string; // pair
  U: number;
  u: number;
  b: BinanceLevel[];
  a: BinanceLevel[];
};
