import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, useMatches, useRouteError } from "react-router";
import type { LinksFunction } from "react-router";
import { Handle } from "~/Handle";

import './app.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'katex/dist/katex.min.css';
import '@fontsource/raleway';

function concatClassNames(cn1: string | undefined, cn2: string | undefined) {
  const concated = [cn1, cn2].filter(cn => cn != undefined).join(' ');
  return concated == '' ? undefined : concated;
}

export default function App() {
  const matches = useMatches();
  const lang = matches.map(m => (m.handle as (Handle | undefined))?.()?.html?.lang).reduceRight((previous, current) => current ?? previous);
  const bodyClassName = matches.map(m => (m.handle as (Handle | undefined))?.()?.body?.className).reduceRight((previous, current) => concatClassNames(previous, current), undefined);

  return (
    <html lang={lang ?? "ja"}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className={bodyClassName}>
        <div id="root">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}