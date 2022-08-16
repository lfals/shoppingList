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
  Text,
  useDisclosure,
  VStack,
  Tooltip,
  Switch,
  Editable,
  EditablePreview,
  EditableInput,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import { Field, Formik } from 'formik';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../components/layout.component';
import { uuid } from 'uuidv4';
import {
  MinusIcon,
  OpenInNewWindowIcon,
  Pencil2Icon,
  TrashIcon,
  PlusIcon,
} from '@radix-ui/react-icons';
import { useRecoilState } from 'recoil';
import { listRecoilContext } from '../hooks/list.hook';
import Head from 'next/head';
import searchImage from '../functions/search.function';
import { IList, IProduct } from '../interfaces/list.interface';
import useSumItemsTotalAmountHook from '../hooks/items.amount.hook';

const List: NextPage = ({ children }: any) => {
  const router = useRouter();
  const [list, setList] = useState({} as IList);
  const [listRecoil, setListRecoil] = useRecoilState(listRecoilContext);
  const [itemsTotalSum, setItemsToSum] = useSumItemsTotalAmountHook();
  const [listTitle, setListTitle] = useState(list.name);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [price, setPrice] = useState('');
  const [items, setItems] = useState([] as IProduct[]);
  const [localItemsArray, setLocalItems] = useState([] as any);
  const [itemToEdit, setItemToEdit] = useState({} as IProduct);
  const id = router.query.id;

  const ENV = process.env.TOKEN ? process.env.TOKEN : '@shoppinglist';

  const defaultValue = {
    id: '',
    name: '',
    store: '',
    link: '',
    qtd: 1,
    show: true,
    price: '',
  };

  function treatCurrency(value: string) {
    value = value?.replace('.', '').replace(',', '').replace(/\D/g, '');
    const options = { minimumFractionDigits: 2 };
    const result = new Intl.NumberFormat('pt-BR', options).format(
      parseFloat(value) / 100
    );
    return `R$ ${result}`;
  }

  function handleCurrency(value: string) {
    setPrice(treatCurrency(value));
  }

  function handleSaveItem(values: any) {
    if (itemToEdit.id !== '') {
      editItem(values);
    } else {
      createItem(values);
    }
  }

  async function createItem(values: any) {
    if (!localItemsArray) {
      console.error('storage vazio, fez merda aí');
      return;
    }

    const imageLink = await searchImage(values.name);

    const mapped = localItemsArray.map((item: IList) => {
      if (item.id === id) {
        item = {
          ...item,
          items: [
            ...item.items,
            {
              id: uuid(),
              ...values,
              price: price,
              image: imageLink,
              show: true,
              qtd: 1,
            },
          ],
        };
      }
      return item;
    });

    const storageList = mapped.filter((item: IList) => item.id === id);

    setItemsToSum(storageList[0]?.items);
    setLocalItems(mapped);
    setItems(storageList[0].items);
    localStorage.setItem(ENV, JSON.stringify(mapped));
    setListRecoil(mapped);
    setPrice('');
    onClose();
  }

  function editItem(values: IProduct) {
    const filtered = items.filter(
      (item: IProduct) => item.id !== itemToEdit?.id
    );
    setItems([
      ...filtered,
      {
        ...values,
        price: price,
        id: itemToEdit.id,
        show: itemToEdit.show,
        qtd: itemToEdit.qtd,
      },
    ]);

    const newArray = localItemsArray.map((item: IList) => {
      if (item.id === id) {
        item = {
          ...item,
          items: [
            ...filtered,
            {
              ...values,
              image: itemToEdit.image,
              price: price,
              id: itemToEdit.id,
              show: itemToEdit.show,
              qtd: itemToEdit.qtd,
            },
          ],
        };
      }
      return item;
    });

    setItemsToSum([
      ...filtered,
      {
        ...values,
        price: price,
        id: itemToEdit.id,
        show: itemToEdit.show,
        qtd: itemToEdit.qtd,
      },
    ]);

    setListRecoil(newArray);
    localStorage.setItem(ENV, JSON.stringify(newArray));
    onClose();
  }

  function handleDeleteItem(productId: string) {
    const newItems = items.filter((item: IProduct) => item.id !== productId);

    const newArray = localItemsArray.map((item: IList) => {
      if (item.id === id) {
        item = {
          ...item,
          items: newItems,
        };
      }
      return item;
    });

    localStorage.setItem(ENV, JSON.stringify(newArray));
    setItems(newItems);
    setLocalItems(newArray);
    setListRecoil(newArray);
  }

  function handleEdit(productId: string) {
    const filtered = items.filter((item: IProduct) => item.id === productId);
    setItemToEdit(filtered[0]);
    setPrice(filtered[0].price);
    onOpen();
  }

  function updateListTitle(newTitle: string) {
    if (newTitle.length === 0) {
      setListTitle(list.name);
      return;
    }
    const newList = localItemsArray.map((list: IList) => {
      if (list.id === id) {
        list = {
          ...list,
          name: newTitle,
        };
      }
      return list;
    });

    setLocalItems(newList);
    localStorage.setItem(ENV, JSON.stringify(newList));
    setListRecoil(newList);
  }

  function togglePriceView(e: any, itemId: string) {
    const newItems = items.map((item) => {
      if (item.id === itemId) {
        item = {
          ...item,
          show: e.target.checked,
        };
      }
      return item;
    });

    const newList = listRecoil.map((list: any) => {
      if (list.id === id) {
        list = {
          ...list,
          items: newItems,
        };
      }
      return list;
    });

    setItems(newItems);
    setItemsToSum(newItems);
    setListRecoil(newList);
    localStorage.setItem(ENV, JSON.stringify(newList));
  }

  function changeItemQtd(qtd: any, itemId: string) {
    const newItems = items.map((item) => {
      if (item.id === itemId) {
        item = {
          ...item,
          qtd: qtd,
        };
      }
      return item;
    });

    const newList = listRecoil.map((list: any) => {
      if (list.id === id) {
        list = {
          ...list,
          items: newItems,
        };
      }
      return list;
    });

    setItemsToSum(newItems);
    setItems(newItems);
    setListRecoil(newList);
    localStorage.setItem(ENV, JSON.stringify(newList));
  }

  function multiplyByAmount(qtd: number, value: string) {
    const multPrice =
      parseFloat(
        value.replaceAll('.', '').replaceAll(',', '').replace('R$', '')
      ) * qtd;
    return treatCurrency(multPrice.toString());
  }

  useEffect(() => {
    const localStorageLists = localStorage.getItem(ENV);

    if (!localStorageLists) {
      router.replace('/');
      return;
    }
    const lists = JSON.parse(localStorageLists);
    const storageList: IList[] = lists.filter((item: IList) => item.id === id);
    if (!storageList[0]) {
      return;
    }

    setItemsToSum(storageList[0].items);
    setList(storageList[0]);
    setListTitle(storageList[0].name);
    setLocalItems(lists);
    setItems(storageList[0]?.items);
  }, [router.query.id, listRecoil]);

  return (
    <>
      <Head>
        <title>{list?.name}</title>
        <meta name="description" content="" />
      </Head>
      <Layout>
        <Box maxW={'900px'} w="100%">
          <Text fontSize={'2xl'} fontWeight="bold">
            {itemsTotalSum}
          </Text>
          <Editable
            variant={'flushed'}
            value={listTitle}
            color={'#fff'}
            fontSize={'7xl'}
            fontWeight="bold"
            onChange={(nextValue: string) => setListTitle(nextValue)}
            onSubmit={(nextValue: string) => updateListTitle(nextValue)}
            style={{
              transition: '0.5s',
              borderRadius: '0px',
            }}
            _hover={{
              borderBottom: '1px solid #fff',
            }}
          >
            <EditablePreview
              textOverflow={'ellipsis'}
              whiteSpace="nowrap"
              overflow={'hidden'}
              w={['300px', '350px', '400px', '600px', '750px']}
            />
            <EditableInput
              _focus={{
                boxShadow: 'none',
                borderBottom: '1px solid #fff',
                borderRadius: '0px',
              }}
            />
          </Editable>
        </Box>
        <Box maxW={'900px'} w="100%">
          <Flex w={'100%'} justifyContent="flex-start">
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
          <VStack py={4} gap="4" h={'auto'}>
            <Accordion
              allowMultiple
              w={'100%'}
              height={['55vh', '60vh']}
              style={{ border: 'none' }}
              overflowY={'auto'}
              pr="4"
            >
              {items?.map((product: IProduct, i) => {
                return (
                  <AccordionItem
                    key={i}
                    style={{ border: 'none' }}
                    mb="4"
                    bgColor={'#20212C'}
                    borderRadius={'12px'}
                    w="100%"
                  >
                    <AccordionButton
                      backgroundColor={'#272833'}
                      borderRadius="12"
                      h={'64px'}
                    >
                      <Flex flex="1" justifyContent={'space-between'} pr="4">
                        <Tooltip label={product.name} placement="top-start">
                          <Text
                            textOverflow={'ellipsis'}
                            whiteSpace="nowrap"
                            overflow={'hidden'}
                            w={['100px', '150px', '200px', '300px']}
                            textAlign="start"
                          >
                            {product.name}
                          </Text>
                        </Tooltip>

                        <Flex gap={4}>
                          {product.qtd > 1 && (
                            <Tooltip
                              label={`Valor total: ${multiplyByAmount(
                                product.qtd,
                                product.price
                              )}`}
                              placement="top"
                              hasArrow
                            >
                              <Text whiteSpace="nowrap">{product.qtd}x</Text>
                            </Tooltip>
                          )}
                          <Text whiteSpace="nowrap">{product.price}</Text>
                          <FormControl display="flex" alignItems="center">
                            <Switch
                              isChecked={product.show}
                              defaultChecked={product.show}
                              onChange={(e) => {
                                togglePriceView(e, product.id);
                              }}
                            />
                          </FormControl>
                        </Flex>
                      </Flex>
                      <AccordionIcon color="white" />
                    </AccordionButton>

                    <AccordionPanel pb={4} borderRadius={'0 0 12px 12px'}>
                      <Flex
                        gap={4}
                        alignItems="center"
                        justifyContent={'center'}
                        flexDir={['column', 'column', 'row']}
                      >
                        <Image
                          boxSize={['200px', '85px']}
                          objectFit="contain"
                          borderRadius={'12px'}
                          src={product.image}
                          bgColor="white"
                        />
                        <Box width={'100%'}>
                          <Link href={product.link} target="_blank">
                            <Flex
                              alignItems={'center'}
                              justifyContent={['space-between', 'flex-start']}
                              gap="18"
                            >
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
                            w={['200px', '250px', '200px', '300px']}
                          >
                            {product.link}
                          </Text>
                        </Box>
                        <Flex>
                          <NumberInput
                            style={{ display: 'flex' }}
                            min={1}
                            max={99}
                            value={product.qtd}
                            onChange={(valueAsNumber: any) => {
                              changeItemQtd(valueAsNumber, product.id);
                            }}
                          >
                            <Button
                              as={NumberDecrementStepper}
                              variant="outline"
                              mr={1}
                            >
                              <Icon fontSize={'xl'} as={MinusIcon} />
                            </Button>
                            <NumberInputField
                              color={'white'}
                              maxW="52px"
                              mr={1}
                              p={2}
                              textAlign={'center'}
                            />
                            <Button
                              as={NumberIncrementStepper}
                              variant="outline"
                              color={'white'}
                              mr={1}
                            >
                              <Icon fontSize={'xl'} as={PlusIcon} />
                            </Button>
                          </NumberInput>

                          <Button
                            onClick={() => handleEdit(product.id)}
                            variant="ghost"
                            mr={1}
                          >
                            <Icon fontSize={'xl'} as={Pencil2Icon} />
                          </Button>
                          <Button
                            onClick={() => handleDeleteItem(product.id)}
                            variant="ghost"
                            mr={1}
                          >
                            <Icon fontSize={'xl'} as={TrashIcon} />
                          </Button>
                        </Flex>
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
