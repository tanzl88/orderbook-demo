export type HuobiLevel = [
  number, // price
  number, // volume
];
export type HuobiOrderbookResponse = {
  ch: string;
  ts: number;
  tick: {
    bids: HuobiLevel[];
    asks: HuobiLevel[];
    version: number;
    ts: number;
  };
};
