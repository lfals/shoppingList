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
  Show,
  HStack,
  useToast,
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
  CounterClockwiseClockIcon,
  QuestionMarkCircledIcon,
} from '@radix-ui/react-icons';
import Head from 'next/head';
import searchImage from '../functions/search.function';
import { IList, IProduct } from '../interfaces/list.interface';
import useSumItemsTotalAmountHook from '../hooks/items.amount.hook';
import useLists from '../hooks/save.list.hook';

const List: NextPage = () => {
  const router = useRouter();
  const toast = useToast();
  const [list, setList] = useState({} as IList);
  const [listRecoil, setLists] = useLists();
  const [itemsTotalSum, setItemsToSum] = useSumItemsTotalAmountHook();
  const [listTitle, setListTitle] = useState(list.name);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [price, setPrice] = useState('R$ 0,00');
  const [items, setItems] = useState([] as IProduct[]);
  const [itemToEdit, setItemToEdit] = useState({} as IProduct);
  const id = router.query.id;

  const defaultValue = {
    id: '',
    name: '',
    store: '',
    link: '',
    image: '',
    qtd: 1,
    show: true,
    price: 'R$ 0,00',
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


    let imageLink = values.image;
    let store = values.store
    if (!imageLink) imageLink = await searchImage(values.name);
    if (!values.store) {
      store = values.link.split('.')[1] ? values.link.split('.')[1] : ""
    }



    const mapped = listRecoil.map((item: IList) => {
      if (item.id === id) {
        item = {
          ...item,
          items: [
            ...item.items,
            {
              id: uuid(),
              ...values,
              store,
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
    setItems(storageList[0].items);
    setLists(mapped);
    setPrice('R$ 0,00');
    onClose();
  }

  async function editItem(values: IProduct) {
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

    let imageLink = values.image;
    if (!imageLink) imageLink = await searchImage(values.name);

    const newArray = listRecoil.map((item: IList) => {
      if (item.id === id) {
        item = {
          ...item,
          items: [
            ...filtered,
            {
              ...values,
              image: imageLink,
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

    setLists(newArray);
    onClose();
  }

  function handleDeleteItem(productId: string) {
    const oldItems = items;
    const oldList = listRecoil;
    const newItems = items.filter((item: IProduct) => item.id !== productId);
    const newArray = listRecoil.map((item: IList) => {
      if (item.id === id) {
        item = {
          ...item,
          items: newItems,
        };
      }
      return item;
    });

    setItems(newItems);
    setLists(newArray);
    toast.closeAll();
    toast({
      position: 'bottom-right',
      duration: 5000,
      render: () => (
        <HStack justifyContent={'end'} p={4}>
          <Button
            leftIcon={<CounterClockwiseClockIcon />}
            colorScheme="red"
            onClick={() => undoDelete(oldList, oldItems)}
          >
            Desfazer
          </Button>
        </HStack>
      ),
    });
  }

  function undoDelete(oldList: IList[], oldItems: IProduct[]) {
    if (oldList !== undefined) {
      setItems(oldItems);
      setLists(oldList);
      toast.closeAll();
    }
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
    const newList = listRecoil.map((list: IList) => {
      if (list.id === id) {
        list = {
          ...list,
          name: newTitle,
        };
      }
      return list;
    });

    setLists(newList);
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
    setLists(newList);
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
    setLists(newList);
  }

  function multiplyByAmount(qtd: number, value: string) {
    const multPrice =
      parseFloat(
        value.replaceAll('.', '').replaceAll(',', '').replace('R$', '')
      ) * qtd;
    return treatCurrency(multPrice.toString());
  }

  useEffect(() => {
    const storageList: IList[] = listRecoil.filter(
      (item: IList) => item.id === id
    );
    if (!storageList[0]) {
      return;
    }

    setItemsToSum(storageList[0].items);
    setList(storageList[0]);
    setListTitle(storageList[0].name);
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
          <Text
            fontSize={'2xl'}
            fontWeight="bold"
            textDecoration={list.show ? '' : 'line-through'}
            opacity={list.show ? '1' : '0.5'}
          >
            {itemsTotalSum}
          </Text>
          <Editable
            variant={'flushed'}
            value={listTitle}
            color={'#fff'}
            fontSize={['4xl', '5xl', '5xl', '6xl']}
            fontWeight="bold"
            onChange={(nextValue: string) => setListTitle(nextValue)}
            onSubmit={(nextValue: string) => updateListTitle(nextValue)}
            style={{
              transition: '0.5s',
              borderRadius: '0px',
              display: 'flex',
            }}
            _hover={{
              borderBottom: '1px solid #fff',
            }}
          >
            <EditablePreview
              textOverflow={'ellipsis'}
              whiteSpace="nowrap"
              overflow={'hidden'}
              textDecoration={list.show ? '' : 'line-through'}
              opacity={list.show ? '1' : '0.5'}
              w={['300px', '450px', '550px', '600px', '700px']}
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
        <Box maxW={'900px'} w="100%" pt={[0, 0, 4, 4, 4]}>
          <Flex w={'100%'} justifyContent="flex-start">
            <Button
              onClick={() => {
                onOpen();
                setPrice('R$ 0,00');
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
                    opacity={product.show ? '1' : '0.5'}
                  >
                    <AccordionButton
                      backgroundColor={'#272833'}
                      borderRadius="12"
                      h={'64px'}
                    >
                      <Flex flex="1" justifyContent={'space-between'} pr="2">
                        <Tooltip label={product.name} placement="top-start">
                          <Text
                            textOverflow={'ellipsis'}
                            whiteSpace="nowrap"
                            overflow={'hidden'}
                            w={['100px', '150px', '200px', '300px']}
                            textAlign="start"
                            textDecoration={product.show ? '' : 'line-through'}
                          >
                            {product.name}
                          </Text>
                        </Tooltip>

                        <Flex gap={4}>
                          {product.qtd > 1 && (
                            <Show above={'md'}>
                              <Tooltip
                                label={`Valor total: ${multiplyByAmount(
                                  product.qtd,
                                  product.price
                                )}`}
                                placement="top"
                                hasArrow
                              >
                                <Text
                                  whiteSpace="nowrap"
                                  textDecoration={
                                    product.show ? '' : 'line-through'
                                  }
                                >
                                  {product.qtd}x
                                </Text>
                              </Tooltip>
                            </Show>
                          )}
                          <Text
                            whiteSpace="nowrap"
                            textDecoration={product.show ? '' : 'line-through'}
                          >
                            {product.price !== 'R$ 0,00' && product.price}
                          </Text>
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
                          alt="Imagem do produto"
                          fallbackSrc="/assets/images/no-image.jfif"
                        />

                        <Box width={'100%'}>
                          {product.store && (
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
                          )}

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
          setPrice('R$ 0,00');
        }}
        isCentered
      >
        <ModalOverlay />
        <Formik
          initialValues={{
            name: itemToEdit?.name,
            store: itemToEdit?.store,
            link: itemToEdit?.link,
            image: itemToEdit?.image,
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
                      <Field as={Input} placeholder="Loja" name="store" />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Link</FormLabel>
                      <Field
                        as={Input}
                        placeholder="Link para o produto"
                        name="link"
                        type="url"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>
                        Imagem
                        <Tooltip
                          label={
                            'Nosso site utiliza o sistema de pesquisa do google para inserir a imagem de forma dinâmica. Caso queira colocar uma imagem específica insira o endereço dela abaixo.'
                          }
                          placement="top"
                          hasArrow
                        >
                          <Icon ml={2} as={QuestionMarkCircledIcon} />
                        </Tooltip>
                      </FormLabel>
                      <Field
                        as={Input}
                        placeholder="Endereço da imagem"
                        name="image"
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
                      setPrice('R$ 0,00');
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
