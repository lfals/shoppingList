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
  Menu,
  MenuButton,
  MenuDivider,
  MenuList as ContextMenu,
  MenuGroup,
  MenuItem,
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
  DropdownMenuIcon,
  HamburgerMenuIcon,
} from '@radix-ui/react-icons';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { uuid } from 'uuidv4';
import useSumListsTotalAmountHook from '../hooks/lists.amount.hook';
import { IList } from '../interfaces/list.interface';
import useLists from '../hooks/save.list.hook';

const MenuList = () => {
  const [show, setShow] = useState(false);
  const inputRef: any = useRef<any>(null);
  const [toRemoveId, setToRemoveId] = useState('');
  const [listRecoil, setLists] = useLists();
  const [amount] = useSumListsTotalAmountHook();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();
  const cancelRef = useRef() as any;
  const router = useRouter();

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

      setLists([...listRecoil, ...defautList]);
      onClose();
      setShow(false);
      router.push(`/${id}`);
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
    setLists(newList);
  }

  function handleCopy(id: string) {
    const selectedList = listRecoil.filter((item) => item.id === id)[0]
    const listToAdd = {
      ...selectedList,
      id: uuid(),
      name: `${selectedList.name} (Copy)`
    }
    console.log(listToAdd);

    setLists([...listRecoil, listToAdd])
  }

  function handleDelete() {
    const newLists = listRecoil.filter((item) => item.id !== toRemoveId);
    const newDeletedList = listRecoil.filter((item) => item.id === toRemoveId);

    setLists(newLists);
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
      setLists(prevList);
      toast.closeAll();
    }
  }

  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.focus();
    }
  }, [show]);

  if (!listRecoil) {
    router.replace('/');
    return null;
  }

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

                <Menu>
                  <MenuButton as={Button}
                    p={0}
                    variant="ghost">
                    <Icon fontSize={'xl'} as={HamburgerMenuIcon} />
                  </MenuButton>
                  <ContextMenu>
                    {/* <MenuGroup title='Profile'>
                      <MenuItem>My Account</MenuItem>
                      <MenuItem>Payments </MenuItem>
                    </MenuGroup>
                    <MenuDivider /> */}
                    <MenuGroup>
                      <MenuItem
                        justifyContent={"space-between"}
                        onClick={() => handleCopy(list.id)}
                      >
                        Duplicar
                      </MenuItem>

                      <MenuItem
                        closeOnSelect={false}
                        justifyContent={"space-between"}

                      >Desabilitar
                        <Switch
                          mr={2}
                          defaultChecked={list.show}
                          isChecked={list.show}
                          onChange={(e) => handleListSwitch(e, list.id)}
                        />
                      </MenuItem>
                      <MenuItem
                        justifyContent={"space-between"}
                        onClick={() => handleDeleteButton(list.id)}
                      >
                        Excluir
                      </MenuItem>
                    </MenuGroup>
                  </ContextMenu>
                </Menu>
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
