import FSHelper from "./FSHelper";
import { ServerModel } from "./server-model";
import Path from 'node:path';

export default class PathMapper {
  server: ServerModel;
  _map: Record<string, string | undefined> = {};

  constructor(server: ServerModel) {
    this.server = server;
  }

  async mapInternal(internalPath: string) {
    if (!Path.isAbsolute(internalPath)) {
      throw new Error(`internalPath should be absolute`);
    }

    const result = await this._mapInternal(internalPath);
    this._map[internalPath] = result;
  }

  async _mapInternal(internalPath: string): Promise<string> {
    if (internalPath.startsWith('/index.ktml')) {
      return internalPath.split('/').slice(0, -1).join('/');
    } else {
      const hash = await FSHelper.getFileHash(this.server.resolveInternalPath(internalPath), 'sha256');
    }
  }

  unmapExternal(externalPath: string) {
    return this._map[externalPath];
  }
}