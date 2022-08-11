import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
  GridItem,
  Hide,
  HStack,
  Icon,
  Input,
  Link,
  list,
  Show,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import {
  Cross2Icon,
  HamburgerMenuIcon,
  PlusIcon,
  TrashIcon,
} from '@radix-ui/react-icons';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { uuid } from 'uuidv4';
import { listRecoilContext } from '../hooks/list.hook';

interface IList {
  id: string;
  name: string;
  items: [{
    price: string
  }]
}

const Layout = ({ children }: any) => {
  const [show, setShow] = useState(false);
  const [lists, setLists] = useState([] as IList[]);
  const [toRemoveId, setToRemoveId] = useState('');
  const [amount, setAmount] = useState('');
  const [listRecoil, setListRecoil] = useRecoilState(listRecoilContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const cancelRef = useRef() as any;

  const router = useRouter();

  const ENV = process.env.TOKEN ? process.env.TOKEN : '@shoppinglist';

  function handleList(data: any) {
    localStorage.setItem(ENV, JSON.stringify(data));
    setLists(data);
  }

  function treatCurrency(value: string) {
    const options = { minimumFractionDigits: 2 };
    const result = new Intl.NumberFormat('pt-BR', options).format(
      parseFloat(value) / 100
    );
    return `R$ ${result}`;
  }

  function handleEnterPress(e: any) {
    const name = e.target.value;

    if (e.key === 'Enter') {
      const id = uuid();
      const defautList = [
        {
          id,
          name,
          items: [],
        },
      ];

      const currentStorage = localStorage.getItem(ENV);

      if (currentStorage) {
        const parsedStorage = JSON.parse(currentStorage);

        handleList([...parsedStorage, ...defautList]);
      } else {
        handleList(defautList);
      }

      router.push(`/${id}`);
      setShow(false);
    }
  }

  function handleDeleteButton(id: string) {
    setToRemoveId(id);
    onOpen();
  }

  function handleDelete() {
    const newLists = lists.filter((item) => item.id !== toRemoveId);

    handleList(newLists);

    onClose();
    if (router.query.id === toRemoveId) {
      router.push('/');
    }
  }

  useEffect(() => {
    const items = localStorage.getItem(ENV);
    if (items) {
      setLists(JSON.parse(items));
      setListRecoil(JSON.parse(items));
    }
  }, []);

  useEffect(() => {
    const initialValue = 0;
    const priceArray = listRecoil.map((list: any) => {
      return list.items.map((item: any) => {
        return item.price
      })
    }).flat(Infinity)
    setAmount(
      priceArray.reduce(
        (previousValue: any, currentValue: any) =>
          previousValue + parseInt(
            currentValue.replace('.', '').replace(',', '').replace('R$', '')
          ),
        initialValue
      )
    )
  }, [listRecoil])

  const MenuList = () => {
    return (
      <VStack h={'100%'} justifyContent="space-between">
        <VStack gap={4} w={'100%'} alignItems="flex-start">
          <HStack w={'100%'} justifyContent="space-between">
            <Text fontSize={'3xl'}>Listas</Text>
            <Button p={0} onClick={() => setShow(true)}>
              <Icon fontSize={'xl'} as={PlusIcon} />
            </Button>
          </HStack>
          {lists.map((item, i) => {
            return (
              <Flex
                justifyContent={'space-between'}
                alignItems="center"
                w="100%"
                key={i}
              >
                <NextLink href={`/${item.id}`} key={i}>
                  <Link style={{ width: '100%' }}>
                    <Text fontSize={'xl'}>{item.name}</Text>
                  </Link>
                </NextLink>
                <Button
                  p={0}
                  variant="ghost"
                  onClick={() => handleDeleteButton(item.id)}
                >
                  <Icon fontSize={'xl'} as={TrashIcon} />
                </Button>
              </Flex>
            );
          })}
          {show && (
            <Input
              variant="flushed"
              placeholder="Nome da lista"
              onKeyDown={(e) => handleEnterPress(e)}
            />
          )}
        </VStack>
        {lists.length > 0 && (
          <HStack w={'100%'} mt={'auto'} justifyContent="space-between">
            <Text fontSize={'xl'}>Valor total:</Text>
            <Text fontSize={'xl'}>{treatCurrency(amount)}</Text>
          </HStack>
        )}
      </VStack>


    );
  };

  return (
    <>
      <Grid
        h="100vh"
        templateRows="80px 1fr"
        templateColumns={['1fr', '300px 1fr', '300px 1fr']}
      >
        <Hide breakpoint="(max-width: 760px)">
          <GridItem
            gridColumnStart={1}
            gridColumnEnd={2}
            gridRowStart={2}
            gridRowEnd={-1}
            p="4"
            bgColor="#20212C"
          >
            <MenuList />
          </GridItem>
        </Hide>
        <GridItem
          gridColumnStart={1}
          gridColumnEnd={3}
          gridRowStart={1}
          gridRowEnd={-2}
          bgColor="#20212C"
        >
          <Show breakpoint="(max-width: 760px)">
            <Flex alignItems={'center'} h="100%" p={'0 12px'}>
              <Button colorScheme="teal" onClick={onDrawerOpen} variant="ghost">
                <Icon as={HamburgerMenuIcon} fontSize="24" />
              </Button>
            </Flex>
          </Show>
        </GridItem>

        <GridItem
          gridColumnStart={2}
          gridColumnEnd={-2}
          gridRowStart={2}
          gridRowEnd={-1}
          bg={'#17181F'}
          p={[4, 8]}
        >
          <Grid
            templateRows={['150px  1fr']}
            templateColumns="1fr"
            gap="12px"
            justifyItems={'center'}
            alignContent="center"
          >
            {children}
          </Grid>
        </GridItem>
      </Grid>

      <AlertDialog
        isCentered
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Excluir Lista
            </AlertDialogHeader>

            <AlertDialogBody>
              Você tem certeza? Você não pode desfazer esta ação depois.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  handleDelete();
                }}
                ml={3}
              >
                Deletar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Drawer isOpen={isDrawerOpen} placement="left" onClose={onDrawerClose}>
        <DrawerOverlay />
        <DrawerContent bgColor={'#20212C'}>
          <Box>
            <DrawerCloseButton as={Cross2Icon} color="white" />
          </Box>
          <DrawerHeader>Create a new account</DrawerHeader>
          <DrawerBody>
            <MenuList />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Layout;
