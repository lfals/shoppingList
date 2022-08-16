import { Box, HStack, Text, Tooltip, VStack } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import Layout from '../components/layout.component';
import { listRecoilContext } from '../hooks/list.hook';
import useSumListsTotalAmountHook from '../hooks/lists.amount.hook';

const List: NextPage = () => {
  const [amount, setSumAmount] = useSumListsTotalAmountHook();

  const [listRecoil, setListRecoil] = useRecoilState(listRecoilContext);
  const ENV = process.env.TOKEN ? process.env.TOKEN : '@shoppinglist';

  function treatCurrency(value: any, cents: boolean) {
    if (isNaN(value))
      value = value.replaceAll('.', '').replaceAll(',', '').replace('R$', '');

    const options = { minimumFractionDigits: 2 };
    const result = new Intl.NumberFormat('pt-BR', options).format(
      parseFloat(value) / 100
    );
    return cents == true ? `R$ ${result}` : `R$ ${result.split(',')[0]}`;
  }

  function handlePriceSum(data: Array<any>) {
    const initialValue = 0;
    const totalPrice = data.reduce((previousValue: any, currentValue: any) => {
      const currentPrice = currentValue.show
        ? parseFloat(
            currentValue.price
              .replaceAll('.', '')
              .replaceAll(',', '')
              .replace('R$', '')
          )
        : 0;
      return previousValue + currentPrice * currentValue.qtd;
    }, initialValue);
    return totalPrice;
  }

  function itemsQuantity(items: Array<any>) {
    const initialValue = 0;
    return items.reduce(
      (previousValue, currentValue) =>
        previousValue + parseFloat(currentValue.qtd),
      initialValue
    );
  }

  useEffect(() => {
    const items = localStorage.getItem(ENV);
    if (items) setListRecoil(JSON.parse(items));
  }, []);

  useEffect(() => {
    setSumAmount(listRecoil);
  }, [listRecoil]);

  return (
    <>
      <Head>
        <title>To Buy List</title>
        <meta name="description" content="A Sua lista de compras" />
      </Head>
      <Layout>
        <Box maxW={'900px'} w="100%">
          <HStack justifyContent={'space-between'} flexWrap={'wrap'}>
            <Box>
              <Text fontSize={['2xl', '3xl', '4xl']} fontWeight="bold">
                Total
              </Text>
              <Text fontSize={['3xl', '4xl', '5xl', '6xl']} fontWeight="bold">
                {amount}
              </Text>
            </Box>
            <Box>
              <Text fontSize={['2xl', '3xl', '4xl']} fontWeight="bold">
                Listas
              </Text>
              <Text fontSize={['3xl', '4xl', '5xl', '6xl']} fontWeight="bold">
                {listRecoil.length}
              </Text>
            </Box>
          </HStack>
        </Box>

        <Box maxW={'900px'} w="100%" mt={[4, 6, 8, 10]} overflowX={'hidden'}>
          <HStack
            height={['60vh']}
            w={'100%'}
            overflowY={'auto'}
            justifyContent={'start'}
            gap={'24px'}
            p={2}
            flexWrap={'wrap'}
            alignItems={'start'}
          >
            {listRecoil.map((list: any) => {
              return (
                <Link href={`/${list.id}`} key={list.id}>
                  <Box
                    p={5}
                    bgColor="#20212C"
                    borderRadius={'12px'}
                    h={'200px'}
                    w={['100%', '100%', '100%', '200px']}
                    style={{
                      marginInlineStart: '0px',
                      cursor: 'pointer',
                      transition: '0.5s',
                    }}
                    _hover={{ boxShadow: '0px 0px 8px 2px #FFFFFF' }}
                  >
                    <VStack justifyContent={'space-between'} h={'100%'}>
                      <Tooltip hasArrow label={list.name} placement="top">
                        <Text
                          fontSize={'3xl'}
                          textAlign="center"
                          fontWeight="bold"
                          textOverflow={'ellipsis'}
                          whiteSpace="nowrap"
                          overflow={'hidden'}
                          w={'100%'}
                        >
                          {list.name}
                        </Text>
                      </Tooltip>
                      <HStack w={'100%'} justifyContent={'space-between'}>
                        <VStack alignItems={'start'}>
                          <Text
                            fontSize={['sm', 'md', 'lg']}
                            textAlign="center"
                          >
                            Itens
                          </Text>
                          <Text
                            style={{ marginTop: '0px' }}
                            fontSize={['sm', 'md', 'lg']}
                            textAlign="center"
                            fontWeight="bold"
                          >
                            {itemsQuantity(list.items)}
                          </Text>
                        </VStack>
                        <VStack alignItems={'start'}>
                          <Text
                            fontSize={['sm', 'md', 'lg']}
                            textAlign="center"
                          >
                            Total
                          </Text>
                          <Text
                            style={{ marginTop: '0px' }}
                            fontSize={['md', 'lg', 'xl']}
                            textAlign="center"
                            fontWeight="bold"
                          >
                            {treatCurrency(handlePriceSum(list.items), false)}
                          </Text>
                        </VStack>
                      </HStack>
                    </VStack>
                  </Box>
                </Link>
              );
            })}
          </HStack>
        </Box>
      </Layout>
    </>
  );
};

export default List;
