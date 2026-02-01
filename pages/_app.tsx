import type { AppProps } from 'next/app';
import Head from 'next/head';
// Import official Seed design tokens for typography classes and effects
import '@seed-health/tokens/css/styles.css';
import '@seed-health/tokens/css/variables.css';
import 'styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1"
        />
        <meta charSet="utf-8" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
