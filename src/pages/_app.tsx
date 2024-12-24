// src/pages/_app.tsx
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import "../app/globals.css"; // Make sure to import your global styles
import { Session } from "next-auth";

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps & { pageProps: { session: Session } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
