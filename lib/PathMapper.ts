import FSHelper from "./FSHelper";
import PathHelper from "./PathHelper";
import { ServerModel } from "./server-model";
import Path from 'node:path';

export default class PathMapper {
  server: ServerModel;
  _map: Record<string, string | undefined> = {};

  constructor(server: ServerModel) {
    this.server = server;
  }

  async mapInternal(internalPath: string) {
    if (!PathHelper.isCanonical(internalPath)) {
      throw new Error(`internalPath should be canonical`);
    }

    const result = await this._mapInternal(internalPath);
    this._map[internalPath] = result;
    return result;
  }

  async _mapInternal(internalPath: string): Promise<string> {
    if (PathHelper.endsWith(internalPath, 'index.ktml')) {
      return PathHelper.pop(internalPath);
    } else if (PathHelper.endsWith(internalPath, 'index.kdml')) {
      return PathHelper.pop(internalPath);
    } else {
      const hash = await FSHelper.getFileHash(Path.join(this.server.rootDir, internalPath), 'sha256');
      return `/file/${hash}${internalPath.substring(internalPath.lastIndexOf('.'))}`
    }
  }

  unmapExternal(externalPath: string) {
    return this._map[externalPath];
  }
}