import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import {
  Text,
  Input,
  ModalContent,
  Button,
  FormLabel,
  Accordion,
  AccordionItem,
} from '../styles/shakraui.component';

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
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
