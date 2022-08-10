// You can also use the more specific type for

import { ComponentStyleConfig } from '@chakra-ui/react';

// a single part component: ComponentSingleStyleConfig

export const Text: ComponentStyleConfig = {
  baseStyle: {
    color: 'white',
  },
};

export const Input: ComponentStyleConfig = {
  baseStyle: {
    field: {
      color: 'white',
    },
  },
};

export const Link: ComponentStyleConfig = {
  baseStyle: {
    color: 'white',
  },
};

export const Button: ComponentStyleConfig = {
  variants: {
    outline: {
      backgroundColor: 'none',
      color: 'white',
      _hover: {
        color: 'black',
      },
    },
    ghost: {
      color: 'white',
      _hover: {
        color: 'black',
      },
    },
  },
};

export const ModalContent: ComponentStyleConfig = {
  baseStyle: {
    backgroundColor: '#272833',
  },
};

export const FormLabel: ComponentStyleConfig = {
  baseStyle: {
    color: 'white',
  },
};

export const Accordion: ComponentStyleConfig = {
  baseStyle: {
    border: 'none',
  },
};

export const AccordionItem: ComponentStyleConfig = {
  baseStyle: {
    border: 'none',
  },
};
