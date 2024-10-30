import Crypto from 'node:crypto';
import FS from 'node:fs';
import FSPromise from 'node:fs/promises';

export default class FSHelper {
  static async readFileUTF8(path: string) {
    return await FSPromise.readFile(path, { encoding: 'utf-8' });
  }

  static async getFileHash(filePath: string, algorithm: string) {
    return new Promise((resolve, reject) => {
      const hash = Crypto.createHash(algorithm);
      const stream = FS.createReadStream(filePath);

      stream.on('error', (error) => {
        reject(error);
      });

      stream.on('data', (chunk) => {
        hash.update(chunk);
      });

      stream.on('end', () => {
        resolve(hash.digest('hex'));
      });
    });
  }
}