import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, useMatches, useRouteError } from "react-router";
import type { LinksFunction } from "react-router";

import "./app.css";
import { Handle } from "lib/handle";

function concatClassNames(cn1: string | undefined, cn2: string | undefined) {
  const concated = [cn1, cn2].filter(cn => cn != undefined).join(' ');
  return concated == '' ? undefined : concated;
}

export default function App() {
  const matches = useMatches();
  const lang = matches.map(m => (m.handle as (Handle | undefined))?.()?.html?.lang).reduceRight((previous, current) => current ?? previous);
  const bodyClassName = matches.map(m => (m.handle as (Handle | undefined))?.()?.body?.className).reduceRight((previous, current) => concatClassNames(previous, current), undefined);

  return (
    <html lang={lang ?? "en"}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className={bodyClassName}>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}