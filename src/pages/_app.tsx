import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import Script from 'next/script';

import {
  Text,
  Input,
  ModalContent,
  Button,
  FormLabel,
  Accordion,
  AccordionItem,
} from '../styles/shakraui.component';
import { RecoilRoot } from 'recoil';
import Head from 'next/head';

const theme = extendTheme({
  components: {
    Text,
    Input,
    ModalContent,
    Button,
    FormLabel,
    Accordion,
    AccordionItem,
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>To buy List</title>
      </Head>
      <div>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'GA_MEASUREMENT_ID');
        `}
        </Script>
      </div>

      <RecoilRoot>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </RecoilRoot>
    </>
  );
}

export default MyApp;
