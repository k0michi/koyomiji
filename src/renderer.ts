import * as fs from 'fs/promises';
import * as fsn from 'fs';
import * as path from 'path';
import { pathToRegexp, Match, match, MatchResult } from "path-to-regexp";

export interface Context {
  params: Record<string, any>;
}

export type Middleware = (ctx: Context) => string | Promise<string> | Buffer | Promise<Buffer>;

export interface Route {
  path: string;
  middleware: Middleware;
}

export class Renderer {
  rootDir: string | null;
  routes: Route[];

  constructor(rootDir: string|null) {
    this.rootDir = rootDir;
    this.routes = [];
  }

  use(path: string, middleware: Middleware) {
    const route = { path, middleware };
    this.routes.push(route);
  }

  async render(pPath: string) {
    for (const route of this.routes) {
      const matchFunc = match(route.path);
      const result = matchFunc(pPath);
      const context: Context = { params: (result as MatchResult).params };

      if (result) {
        let content = route.middleware(context);

        if (content instanceof Promise) {
          content = await content;
        }

        if (content instanceof Buffer) {
          await fs.mkdir(path.dirname(path.join(this.rootDir!, pPath)), { recursive: true });
          await fs.writeFile(path.join(this.rootDir!, pPath), content);
          console.log(path.join(this.rootDir!, pPath))
          break;
        }else if (typeof content == 'string'){
          await fs.mkdir(path.dirname(path.join(this.rootDir!, pPath)), { recursive: true });
          await fs.writeFile(path.join(this.rootDir!, pPath), content);
          console.log(path.join(this.rootDir!, pPath))
          break;
        }
      }
    }
  }

  async renderToString(pPath: string) {
    for (const route of this.routes) {
      const matchFunc = match(route.path);
      const result = matchFunc(pPath);
      const context: Context = { params: (result as MatchResult).params };

      if (result) {
        let content = route.middleware(context);

        if (content instanceof Promise) {
          content = await content;
        }

        if (content instanceof Buffer) {
          return content;
        }else if (typeof content == 'string'){
          return content;
        }

        throw new Error('Unexpected');
      }
    }
  }
}