import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';
export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="shortcut icon" href="/favicon.png" />
        <meta name="description" content="A lista de compras que faltava" />

        <meta property="og:url" content="https://tobuylist.fluma.dev/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="To buy List" />
        <meta
          property="og:description"
          content="A lista de compras que faltava"
        />
        <meta property="og:image" content="/api/og" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="tobuylist.fluma.dev" />
        <meta property="twitter:url" content="https://tobuylist.fluma.dev/" />
        <meta name="twitter:title" content="To buy List" />
        <meta
          name="twitter:description"
          content="A lista de compras que faltava"
        />
        <meta name="twitter:image" content="/api/og" />
        <link href="/favicon.png" rel="icon" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/favicon.png"></link>
        <meta name="theme-color" content="#1A202C" />
      </Head>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-7NEKCFJ0EB"
      ></Script>
      <Script id="gtag">
        {`
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());

       gtag('config', 'G-7NEKCFJ0EB');
       `}
      </Script>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
