import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
  GridItem,
  Hide,
  HStack,
  Icon,
  Image,
  Link,
  Show,
  useDisclosure,
} from '@chakra-ui/react';
import { Cross2Icon, HamburgerMenuIcon } from '@radix-ui/react-icons';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { listRecoilContext } from '../hooks/list.hook';
import useSumListsTotalAmountHook from '../hooks/lists.amount.hook';
import { IList } from '../interfaces/list.interface';
import MenuList from './menu.component';

const Layout = ({ children }: any) => {
  const [, setLists] = useState([] as IList[]);
  const [listRecoil, setListRecoil] = useRecoilState(listRecoilContext);
  const [, setSumAmount] = useSumListsTotalAmountHook();
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const ENV = process.env.TOKEN ? process.env.TOKEN : '@shoppinglist';

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
      <Grid
        h="100vh"
        overflowY={'hidden'}
        templateRows="80px 1fr"
        templateColumns={['1fr', '1fr', '200px 1fr', '300px 1fr']}
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
          <HStack h={'100%'} px={3} justifyContent="space-between">
            <NextLink href={'/'}>
              <Link>
                <Image
                  src="/assets/images/logo.png"
                  style={{
                    filter: 'brightness(0) invert(1)',
                    pointerEvents: 'none',
                  }}
                  alt="logo"
                />
              </Link>
            </NextLink>

            <Show breakpoint="(max-width: 760px)">
              <Flex alignItems={'center'} h="100%" p={'0 12px'}>
                <Button
                  colorScheme="teal"
                  onClick={onDrawerOpen}
                  variant="ghost"
                >
                  <Icon as={HamburgerMenuIcon} fontSize="24" />
                </Button>
              </Flex>
            </Show>
          </HStack>
        </GridItem>

        <GridItem
          gridColumnStart={2}
          gridColumnEnd={-2}
          gridRowStart={2}
          gridRowEnd={-1}
          bg={'#17181F'}
          p={[4, 8]}
          overflowX="hidden"
        >
          <Grid
            templateRows={['120px  1fr']}
            templateColumns="1fr"
            gap="12px"
            justifyItems={'center'}
            alignContent="center"
          >
            {children}
          </Grid>
        </GridItem>
      </Grid>

      <Drawer isOpen={isDrawerOpen} placement="left" onClose={onDrawerClose}>
        <DrawerOverlay />
        <DrawerContent bgColor={'#20212C'}>
          <Box>
            <DrawerCloseButton as={Cross2Icon} color="white" mt={2} mr={1} />
          </Box>
          <DrawerHeader></DrawerHeader>
          <DrawerBody mt={4} py={5} px={3}>
            <MenuList />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Layout;
