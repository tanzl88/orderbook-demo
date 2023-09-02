import { Injectable } from '@nestjs/common';
import { gunzip } from 'zlib';

@Injectable()
export class GzipService {
  async unzip(input: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        gunzip(input, (err, buffer) => {
          resolve(buffer.toString());
        });
      } catch (e) {
        console.error(input);
        throw 'Error when unzipping.';
      }
    });
  }
}
