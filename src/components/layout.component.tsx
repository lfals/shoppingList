import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  Input,
  Link,
  Show,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { uuid } from 'uuidv4';

interface IList {
  id: string;
  name: string;
}

const Layout = ({ children }: any) => {
  const [show, setShow] = useState(false);
  const [lists, setLists] = useState([] as IList[]);
  const [toRemoveId, setToRemoveId] = useState('');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef() as any;

  const router = useRouter();

  const ENV = process.env.TOKEN ? process.env.TOKEN : '@shoppinglist';

  function setShowInput(toShow: boolean) {
    setShow(toShow);
  }

  function handleEnterPress(e: any) {
    const name = e.target.value;

    if (e.key === 'Enter') {
      const id = uuid();

      const currentStorage = localStorage.getItem(ENV);

      const defautList = [
        {
          id,
          name,
          items: [],
        },
      ];

      if (currentStorage) {
        const parsedStorage = JSON.parse(currentStorage);

        const newList = [...parsedStorage, defautList];

        localStorage.setItem(ENV, JSON.stringify(newList));
        setLists(newList);
        setShow(false);

        router.push(`/${id}`);
        return;
      }

      router.push(`/${id}`);
      localStorage.setItem(ENV, JSON.stringify(defautList));
      setLists(defautList);
      setShow(false);
    }
  }

  function handleDeleteButton(id: string) {
    setToRemoveId(id);
    onOpen();
  }

  function handleDelete() {
    const newLists = lists.filter((item) => item.id !== toRemoveId);

    setLists(newLists);
    localStorage.setItem(ENV, JSON.stringify(newLists));

    onClose();
    if (router.query.id === toRemoveId) {
      router.push('/');
    }
  }

  useEffect(() => {
    const items = localStorage.getItem(ENV);
    if (items) {
      setLists(JSON.parse(items));
    }
  }, []);

  return (
    <>
      <Grid
        h="100vh"
        templateRows="80px 1fr"
        templateColumns={{ lg: '300px 1fr' }}
      >
        <Show above="lg">
          <GridItem
            gridColumnStart={1}
            gridColumnEnd={2}
            gridRowStart={2}
            gridRowEnd={-1}
            p="4"
            bgColor="#20212C"
          >
            <VStack gap={4} alignItems="flex-start">
              <HStack w={'100%'} justifyContent="space-between">
                <Text fontSize={'3xl'}>Listas</Text>
                <Button p={0} onClick={() => setShowInput(true)}>
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
                      <Link>
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
          </GridItem>
        </Show>

        <GridItem
          gridColumnStart={1}
          gridColumnEnd={3}
          gridRowStart={1}
          gridRowEnd={-2}
          bgColor="#20212C"
        >
          <Box></Box>
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
            templateRows={['min-content 1fr', '150px  1fr']}
            templateColumns="1fr"
            height={'100%'}
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
    </>
  );
};

export default Layout;
