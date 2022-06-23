import * as fs from 'fs/promises';
import * as path from 'path';
import { Match, match, MatchResult } from "path-to-regexp";

export interface Context {
  params: object;
}

export type Middleware = (ctx: Context) => string | Promise<string>;

export interface Route {
  path: string;
  middleware: Middleware;
}

export class Renderer {
  rootDir: string;
  routes: Route[];

  constructor(rootDir: string) {
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

        await fs.mkdir(path.dirname(path.join(this.rootDir, pPath)), { recursive: true });
        await fs.writeFile(path.join(this.rootDir, pPath), content);
        console.log(path.join(this.rootDir, pPath))
        break;
      }
    }
  }
}