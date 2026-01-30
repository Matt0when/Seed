import type { AppProps } from 'next/app';
import Head from 'next/head';
import 'styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <title>Seed Frontend Engineering Takehome</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
