export type KrakenLevel = [
  string, // price
  string, // volume
  string, // timestamp
  string, // update type
];
export type KrakenOrderbookResponse = [
  number, //channel ID
  {
    as: KrakenLevel[];
    bs: KrakenLevel[];
    a: KrakenLevel[];
    b: KrakenLevel[];
    c: string; // checksum
  },
  string, //channel name
  string, //pair
];
