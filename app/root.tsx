import type { MetaFunction } from "remix";
import {
  Links,
  LinksFunction,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "remix";
import appStyleUrl from "~/styles/app.css";
import { env } from "./utils/misc";

export const meta: MetaFunction = () => {
  return { title: "Oldweb2 blog" };
};

export let links: LinksFunction = () => {
  return [
    {
      rel: "preconnect",
      href: "//fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    { rel: "stylesheet", href: appStyleUrl },
    {
      rel: "stylesheet",
      href: "//fonts.googleapis.com/css?family=Work+Sans:300,400,600,700&amp;lang=en",
    },
    {
      rel: "stylesheet",
      href: "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css",
    },
  ];
};

export default function App() {
  return (
    <html data-theme="cmyk" lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="remix-root remix-app container mx-auto">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        {env("production") && (
          <>
            <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-B1211RB418"
            />
            <script async src="/scripts/analytics" />
          </>
        )}
        {env("development") && <LiveReload />}
      </body>
    </html>
  );
}
