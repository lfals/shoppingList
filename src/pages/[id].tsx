import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Icon,
  Image,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Show,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { Field, Formik, useFormik } from 'formik';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../components/layout.component';
import { uuid } from 'uuidv4';
import {
  OpenInNewWindowIcon,
  Pencil2Icon,
  TrashIcon,
} from '@radix-ui/react-icons';

interface IList {
  id?: string;
  name: string;
  items: Array<IProduct>;
}

interface IProduct {
  id: string;
  name: string;
  store: string;
  link: string;
  image: string;
  price: string;
}

const List: NextPage = ({ children }: any) => {
  const router = useRouter();
  const [list, setList] = useState({} as IList);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [price, setPrice] = useState('');
  const [priceSum, setPriceSum] = useState('');
  const [items, setItems] = useState([] as IProduct[]);
  const [localItemsArray, setLocalItems] = useState([] as any);
  const [itemToEdit, setItemToEdit] = useState({} as IProduct);
  const id = router.query.id;

  const ENV = process.env.TOKEN ? process.env.TOKEN : '@shoppinglist';

  const defaultValue = {
    id: '',
    name: '',
    store: '',
    image: '',
    link: '',
    price: '',
  };

  function treatCurrency(value: string) {
    value = value?.replace('.', '').replace(',', '').replace(/\D/g, '');

    const options = { minimumFractionDigits: 2 };
    const result = new Intl.NumberFormat('pt-BR', options).format(
      parseFloat(value) / 100
    );
    return `R$${result}`;
  }

  function handlePriceSum(data: Array<any>) {
    const initialValue = 0;

    const totalPrice = data.reduce(
      (previousValue: any, currentValue: any) =>
        previousValue +
        parseInt(
          currentValue.price.replace('.', '').replace(',', '').replace('R$', '')
        ),
      initialValue
    );

    return totalPrice;
  }

  function handleCurrency(value: string) {
    setPrice(treatCurrency(value));
  }

  function handleSaveItem(values: any) {
    console.log(itemToEdit, values);
    if (itemToEdit.id !== '') {
      editItem(values);
    } else {
      createItem(values);
    }
  }

  function createItem(values: any) {
    if (!localItemsArray) {
      console.error('storage vazio, fez merda aí');
      return;
    }

    const mapped = localItemsArray.map((item: IList) => {
      if (item.id === id) {
        item.items = [
          ...item.items,
          {
            id: uuid(),
            ...values,
            price: price,
          },
        ];
      }
      return item;
    });

    const storageList = mapped.filter((item: IList) => item.id === id);

    const totalPrice = handlePriceSum(storageList[0]?.items);

    setPriceSum(treatCurrency(totalPrice?.toString()));
    setLocalItems(mapped);
    setItems(storageList[0].items);
    localStorage.setItem(ENV, JSON.stringify(mapped));
    setPrice('');
    onClose();
  }

  function editItem(values: IProduct) {
    const filtered = items.filter(
      (item: IProduct) => item.id !== itemToEdit?.id
    );

    setItems([...filtered, { ...values, price: price, id: itemToEdit.id }]);

    const newArray = localItemsArray.map((item: IList) => {
      if (item.id === id) {
        item.items = [
          ...filtered,
          { ...values, price: price, id: itemToEdit.id },
        ];
      }
      return item;
    });

    const totalPrice = handlePriceSum([
      ...filtered,
      { ...values, price: price, id: itemToEdit.id },
    ]);

    setPriceSum(treatCurrency(totalPrice?.toString()));
    localStorage.setItem(ENV, JSON.stringify(newArray));
    onClose();
  }

  function handleDeleteItem(productId: string) {
    const newItems = items.filter((item: IProduct) => item.id !== productId);

    const newArray = localItemsArray.map((item: IList) => {
      if (item.id === id) {
        item.items = newItems;
      }
      return item;
    });

    localStorage.setItem(ENV, JSON.stringify(newArray));
    setItems(newItems);
  }

  function handleEdit(productId: string) {
    const filtered = items.filter((item: IProduct) => item.id === productId);

    setItemToEdit(filtered[0]);
    setPrice(filtered[0].price);
    onOpen();
  }

  useEffect(() => {
    const localItems = localStorage.getItem(ENV);

    if (!localItems) {
      router.replace('/');
      return;
    }
    const items = JSON.parse(localItems);
    const storageList = items.filter((item: IList) => item.id === id);
    if (!storageList[0]) {
      return;
    }
    setList(storageList[0]);

    const totalPrice = handlePriceSum(storageList[0].items);

    setPriceSum(treatCurrency(totalPrice?.toString()));

    setLocalItems(items);
    setItems(storageList[0]?.items);
  }, [router.query.id]);

  return (
    <>
      <Layout>
        <Box maxW={'800px'} w="100%">
          <Text fontSize={'2xl'} fontWeight="bold">
            {priceSum}
          </Text>
          <Text fontSize={'7xl'} fontWeight="bold">
            {list?.name}
          </Text>
        </Box>
        <Box maxW={'800px'} w="100%">
          <Flex w={'100%'} justifyContent="flex-end">
            <Button
              onClick={() => {
                onOpen();
                setPrice('');
                setItemToEdit(defaultValue);
              }}
            >
              Adicionar
            </Button>
          </Flex>
          <VStack py={4} gap="4" h={'100%'}>
            <Accordion allowMultiple w={'100%'} style={{ border: 'none' }}>
              {items?.map((product: IProduct, i) => {
                return (
                  <AccordionItem
                    key={i}
                    style={{ border: 'none' }}
                    mb="4"
                    bgColor={'#20212C'}
                    borderRadius={'0 0 12px 12px'}
                    w="100%"
                  >
                    <AccordionButton
                      backgroundColor={'#272833'}
                      borderRadius="12"
                      h={'64px'}
                    >
                      <Flex flex="1" justifyContent={'space-between'} pr="4">
                        <Text>{product.name}</Text>
                        <Flex gap={4}>
                          <Text>{product.price}</Text>
                        </Flex>
                      </Flex>
                      <AccordionIcon color="white" />
                    </AccordionButton>

                    <AccordionPanel pb={4} borderRadius={'0 0 12px 12px'}>
                      <Flex gap={4} alignItems="center" wrap={'wrap'}>
                        <Image
                          boxSize="85px"
                          objectFit="contain"
                          borderRadius={'12px'}
                          src={product.image}
                          bgColor="white"
                        />
                        <Box width={'100%'}>
                          <Link href={product.link} target="_blank">
                            <Flex alignItems={'center'} gap="18">
                              <Text fontSize={'3xl'}>{product.store}</Text>
                              <Icon
                                color={'white'}
                                fontSize="xl"
                                as={OpenInNewWindowIcon}
                              />
                            </Flex>
                          </Link>
                          <Text
                            textOverflow={'ellipsis'}
                            whiteSpace="nowrap"
                            overflow={'hidden'}
                            w={'300px'}
                          >
                            {product.link}
                          </Text>
                        </Box>
                        <Button
                          onClick={() => handleEdit(product.id)}
                          variant="ghost"
                        >
                          <Icon fontSize={'xl'} as={Pencil2Icon} />
                        </Button>
                        <Button
                          onClick={() => handleDeleteItem(product.id)}
                          variant="ghost"
                        >
                          <Icon fontSize={'xl'} as={TrashIcon} />
                        </Button>
                      </Flex>
                    </AccordionPanel>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </VStack>
        </Box>
      </Layout>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setPrice('');
        }}
        isCentered
      >
        <ModalOverlay />
        <Formik
          initialValues={{
            name: itemToEdit?.name,
            store: itemToEdit?.store,
            image: itemToEdit?.image,
            link: itemToEdit?.link,
            price: itemToEdit?.price,
          }}
          onSubmit={(values) => handleSaveItem(values)}
        >
          {({ handleSubmit, handleReset }) => (
            <form onSubmit={handleSubmit}>
              <ModalContent bgColor={'#272833'}>
                <ModalHeader color={'white'}>
                  {itemToEdit.id !== '' ? 'Editar' : 'Adicionar'}
                </ModalHeader>
                <ModalCloseButton color={'white'} />
                <ModalBody>
                  <VStack gap={2}>
                    <FormControl>
                      <FormLabel>Nome</FormLabel>
                      <Field
                        as={Input}
                        placeholder="Nome"
                        name="name"
                        id="name"
                        required
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Imagem</FormLabel>
                      <Field
                        as={Input}
                        placeholder="Imagem"
                        name="image"
                        id="image"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Loja</FormLabel>
                      <Field
                        as={Input}
                        placeholder="Loja"
                        name="store"
                        required
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Link</FormLabel>
                      <Field
                        as={Input}
                        placeholder="Link"
                        name="link"
                        type="url"
                        required
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Preço</FormLabel>
                      <Field
                        as={Input}
                        name="price"
                        placeholder="Preço"
                        onChange={(e: any) => handleCurrency(e.target.value)}
                        value={price}
                        required
                      />
                    </FormControl>
                  </VStack>
                </ModalBody>

                <ModalFooter>
                  <Button
                    mr={3}
                    onClick={() => {
                      handleReset();
                      onClose();
                      setPrice('');
                    }}
                    variant="outline"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" variant="ghost">
                    Salvar
                  </Button>
                </ModalFooter>
              </ModalContent>
            </form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default List;
