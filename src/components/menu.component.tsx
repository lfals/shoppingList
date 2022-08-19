import React from 'react';
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
  HStack,
  Icon,
  Input,
  Link,
  Switch,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import {
  PlusIcon,
  TrashIcon,
  CounterClockwiseClockIcon,
} from '@radix-ui/react-icons';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { uuid } from 'uuidv4';
import { listRecoilContext } from '../hooks/list.hook';
import useSumListsTotalAmountHook from '../hooks/lists.amount.hook';
import { IList, IProduct } from '../interfaces/list.interface';

function MenuList() {
  const [show, setShow] = useState(false);
  const inputRef: any = useRef<any>(null);
  const [toRemoveId, setToRemoveId] = useState('');
  const [listRecoil, setListRecoil] = useRecoilState(listRecoilContext);
  const [amount] = useSumListsTotalAmountHook();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();
  const cancelRef = useRef() as any;

  const router = useRouter();

  const ENV = process.env.TOKEN ? process.env.TOKEN : '@shoppinglist';

  function handleEnterPress(e: any) {
    const name: string = e.target.value;

    if (e.key === 'Enter') {
      const id: string = uuid();
      const defautList: IList[] = [
        {
          id,
          name,
          show: true,
          items: [],
        },
      ];

      const currentStorage = localStorage.getItem(ENV);

      if (currentStorage) {
        const parsedStorage = JSON.parse(currentStorage);

        setListRecoil([...parsedStorage, ...defautList]);
      } else {
        setListRecoil(defautList);
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
    localStorage.setItem(ENV, JSON.stringify(newList));
  }

  function handleDelete() {
    const newLists = listRecoil.filter((item) => item.id !== toRemoveId);
    const newDeletedList = listRecoil.filter((item) => item.id === toRemoveId);

    setListRecoil(newLists);
    onClose();
    if (router.query.id === toRemoveId) {
      router.push('/');
    }
    toast({
      position: 'bottom-right',
      duration: 5000,
      render: () => (
        <HStack justifyContent={'end'} p={4}>
          <Button
            leftIcon={<CounterClockwiseClockIcon />}
            colorScheme="red"
            onClick={() => undoDelete(newLists, newDeletedList)}
          >
            Desfazer
          </Button>
        </HStack>
      ),
    });
  }

  function undoDelete(newLists: IList[], newDeletedList: IList[]) {
    if (newDeletedList !== undefined) {
      const prevList = [...newLists, ...newDeletedList];
      setListRecoil(prevList);
      toast.closeAll();
    }
  }

  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.focus();
    }
  }, [show]);

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
          {listRecoil?.map((list, i) => {
            return (
              <Flex
                justifyContent={'space-between'}
                alignItems="center"
                w="100%"
                key={i}
              >
                <NextLink href={`/${list.id}`} key={i}>
                  <Link style={{ width: '100%' }}>
                    <Text
                      fontSize={'xl'}
                      textOverflow={'ellipsis'}
                      whiteSpace="nowrap"
                      overflow={'hidden'}
                      w="150px"
                      textDecoration={list.show ? '' : 'line-through'}
                      opacity={list.show ? '1' : '0.5'}
                    >
                      {list.name}
                    </Text>
                  </Link>
                </NextLink>
                <Switch
                  mr={2}
                  defaultChecked={list.show}
                  isChecked={list.show}
                  onChange={(e) => handleListSwitch(e, list.id)}
                />
                <Button
                  p={0}
                  variant="ghost"
                  onClick={() => handleDeleteButton(list.id)}
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
              ref={inputRef}
            />
          )}
        </VStack>
        {listRecoil.length > 0 && (
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

            <AlertDialogBody>Deseja realmente deletar a lista?</AlertDialogBody>

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
