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
  MenuList as LoginMenu,
  GridItem,
  Hide,
  HStack,
  Icon,
  Image,
  Link,
  Show,
  useDisclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuGroup,
  Avatar,
} from '@chakra-ui/react';
import {
  Cross2Icon,
  EnterIcon,
  ExitIcon,
  HamburgerMenuIcon,
  TwitterLogoIcon,
} from '@radix-ui/react-icons';
import { onValue, ref } from 'firebase/database';
import NextLink from 'next/link';
import { useEffect } from 'react';
import treatOldList from '../functions/handle.old.list.function';
import useLists from '../hooks/save.list.hook';
import useAuth from '../hooks/user.hook';
import { IList } from '../interfaces/list.interface';
import { db } from '../services/firebase.service';
import MenuList from './menu.component';

const Layout = ({ children }: any) => {
  const [user, signIn, logOut] = useAuth();
  const [, setLists] = useLists();

  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  function treatListsFromFB(data: IList[]) {
    const treated = data.map((list) => {
      if (list.items === undefined) {
        list = {
          ...list,
          items: [],
        };
      }
      return list;
    });
    setLists(treated);
  }

  function getCloudList(userId: string) {
    const starCountRef = ref(db, 'users/' + userId);
    onValue(starCountRef, (snapshot) => {
      const val = snapshot.val();
      const data = val;
      if (data) {
        treatListsFromFB(data.data);
      }
    });
  }

  useEffect(() => {
    if (user) {
      getCloudList(user.uid);
      return;
    }

    const checkIfItemHasShowField = treatOldList();
    if (checkIfItemHasShowField) {
      setLists(checkIfItemHasShowField);
    }
  }, [user]);

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
            <NextLink href={'/'}>
              <Link>
                <Image
                  src="/assets/images/logo.png"
                  style={{
                    filter: 'brightness(0) invert(1)',
                    pointerEvents: 'none',
                  }}
                  w="100px"
                  alt="logo"
                />
              </Link>
            </NextLink>
            {user ? (
              <Menu>
                <MenuButton
                  as={Avatar}
                  src={user.photoURL ? user.photoURL : ''}
                  name={user.displayName ? user.displayName : 'Foto de perfil'}
                ></MenuButton>
                <LoginMenu>
                  <MenuGroup defaultValue="asc">
                    <MenuItem onClick={() => logOut()} icon={<ExitIcon />}>
                      Sair
                    </MenuItem>
                  </MenuGroup>
                </LoginMenu>
              </Menu>
            ) : (
              <Menu>
                <MenuButton as={Button} variant="ghost">
                  <Icon as={EnterIcon} fontSize="20" />
                </MenuButton>
                <LoginMenu>
                  <MenuGroup defaultValue="asc" title="Login">
                    <MenuItem
                      onClick={() => signIn.google()}
                      icon={<TwitterLogoIcon />}
                    >
                      Google
                    </MenuItem>

                    <MenuItem
                      onClick={() => signIn.twitter()}
                      icon={<TwitterLogoIcon />}
                    >
                      Twitter
                    </MenuItem>
                  </MenuGroup>
                </LoginMenu>
              </Menu>
            )}
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
