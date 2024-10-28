import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, useMatches, useRouteError } from "react-router";
import type { LinksFunction } from "react-router";

import "./app.css";

// type Handle = () => { lang: string };

export default function App() {
  // const matches = useMatches();
  // const lang = matches.map(m => (m.handle as (Handle | undefined))?.()?.lang).reduceRight((previous, current) => current ?? previous);

  return (
    // <html lang={lang ?? "en"}>
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}