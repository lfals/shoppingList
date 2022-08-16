import React from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  HStack,
  Icon,
  Input,
  Link,
  Switch,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { uuid } from 'uuidv4';
import { listRecoilContext } from '../hooks/list.hook';
import useSumListsTotalAmountHook from '../hooks/lists.amount.hook';
import { IList } from '../interfaces/list.interface';

function MenuList() {
  const [show, setShow] = useState(false);
  const [lists, setLists] = useState([] as IList[]);
  const [toRemoveId, setToRemoveId] = useState('');
  const [listRecoil, setListRecoil] = useRecoilState(listRecoilContext);
  const [amount, setSumAmount] = useSumListsTotalAmountHook();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const cancelRef = useRef() as any;

  const router = useRouter();

  const ENV = process.env.TOKEN ? process.env.TOKEN : '@shoppinglist';

  function handleList(data: any) {
    localStorage.setItem(ENV, JSON.stringify(data));
    setLists(data);
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

  function handleListSwitch(e: any, id: string) {
    console.log(e.target.checked, id);
    const newList = listRecoil.map((list) => {
      if (list.id === id) {
        list = {
          ...list,
          show: e.target.checked,
        };
      }
      return list;
    });
    setListRecoil(newList);
    setLists(newList);
    localStorage.setItem(ENV, JSON.stringify(newList));
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
    const lists = localStorage.getItem(ENV);

    if (lists) {
      const parsedLists: Array<IList> = JSON.parse(lists);
      const checkIfItemHasShowField = parsedLists.map((list) => {
        if (list.show === undefined) {
          list = {
            ...list,
            show: true,
          };
        }
        list = {
          ...list,
          items: list.items.map((item) => {
            if (item.show === undefined) {
              item = {
                ...item,
                show: true,
              };
            }
            if (item.qtd === undefined) {
              item = {
                ...item,
                qtd: 1,
              };
            }
            return item;
          }),
        };
        return list;
      });

      setLists(checkIfItemHasShowField);
      setListRecoil(checkIfItemHasShowField);
      localStorage.setItem(ENV, JSON.stringify(checkIfItemHasShowField));
    }
  }, []);

  useEffect(() => {
    setSumAmount(listRecoil);
  }, [listRecoil]);

  return (
    <>
      <VStack h={'100%'} justifyContent="space-between">
        <VStack gap={4} w={'100%'} alignItems="flex-start">
          <HStack w={'100%'} justifyContent="space-between">
            <Text fontSize={'3xl'}>Listas</Text>
            <Button p={0} onClick={() => setShow(true)}>
              <Icon fontSize={'xl'} as={PlusIcon} />
            </Button>
          </HStack>
          {listRecoil?.map((item, i) => {
            return (
              <Flex
                justifyContent={'space-between'}
                alignItems="center"
                w="100%"
                key={i}
              >
                <NextLink href={`/${item.id}`} key={i}>
                  <Link style={{ width: '100%' }}>
                    <Text
                      fontSize={'xl'}
                      textOverflow={'ellipsis'}
                      whiteSpace="nowrap"
                      overflow={'hidden'}
                      w="150px"
                    >
                      {item.name}
                    </Text>
                  </Link>
                </NextLink>
                <Switch
                  mr={2}
                  defaultChecked={item.show}
                  isChecked={item.show}
                  onChange={(e) => handleListSwitch(e, item.id)}
                />
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
            <Text fontSize={'xl'}>{amount}</Text>
          </HStack>
        )}
      </VStack>

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
}

export default MenuList;
