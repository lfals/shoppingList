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
      <RecoilRoot>
        <ChakraProvider theme={theme}>
          <Head>
            <title>To buy List</title>
          </Head>
          <>
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-7NEKCFJ0EB"
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                
                  gtag('config', 'G-7NEKCFJ0EB');
        `}
            </Script>
          </>
          <Component {...pageProps} />
        </ChakraProvider>
      </RecoilRoot>
    </>
  );
}

export default MyApp;
