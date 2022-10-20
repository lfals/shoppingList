import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="shortcut icon" href="/favicon.png" />
        <meta property="og:title" content="To buy List" />
        <meta
          property="og:image"
          content="https://tobuylist.fluma.dev/thumbnail.png"
        />
        <meta
          property="og:description"
          content="A lista de compras que faltava"
        />
        <meta property="og:url" content="https://tobuylist.fluma.dev/" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="627" />
        <meta property="og:type" content="website" />
        <link rel="manifest" href="/manifest.json" />
        <link
          href="/favicon.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/favicon.png"></link>
        <meta name="theme-color" content="#1A202C" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
