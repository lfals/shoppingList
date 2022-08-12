import { Box, Grid, GridItem, HStack, Stack, Text, Tooltip, VStack } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import Layout from '../components/layout.component';
import { listRecoilContext } from '../hooks/list.hook';

interface IList {
  id: string;
  name: string;
}



const List: NextPage = () => {
  const [amount, setAmount] = useState('');
  const [listRecoil, setListRecoil] = useRecoilState(listRecoilContext);
  const ENV = process.env.TOKEN ? process.env.TOKEN : '@shoppinglist';


  function treatCurrency(value: any, cents: boolean) {
    if (isNaN(value)) value = value.replaceAll('.', '').replaceAll(',', '').replace('R$', '');

    const options = { minimumFractionDigits: 2 };
    const result = new Intl.NumberFormat('pt-BR', options).format(
      parseFloat(value) / 100
    );
    return cents == true ? `R$ ${result}` : `R$ ${result.split(',')[0]}`
  }

  function handlePriceSum(data: Array<any>) {
    const initialValue = 0;
    const totalPrice = data.reduce(
      (previousValue: any, currentValue: any) =>
        previousValue +
        parseFloat(
          currentValue.price.replaceAll('.', '').replaceAll(',', '').replace('R$', '')
        ),
      initialValue
    );
    return totalPrice;
  }

  useEffect(() => {
    const items = localStorage.getItem(ENV);
    if (items) setListRecoil(JSON.parse(items));
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
            currentValue.replaceAll('.', '').replaceAll(',', '').replace('R$', '')
          ),
        initialValue
      )
    )
  }, [listRecoil])

  return (
    <>
      <Layout>
        <Box maxW={'900px'} w="100%">
          <HStack justifyContent={'space-between'} flexWrap={'wrap'}>
            <Box>
              <Text fontSize={['2xl', '3xl', '4xl']} fontWeight="bold">
                Total
              </Text>
              <Text fontSize={['3xl', '4xl', '5xl', '6xl']} fontWeight="bold">
                {treatCurrency(amount, true)}
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
            {
              listRecoil.map((list: any) => {
                return (
                  <Link href={`/${list.id}`} key={list.id}>
                    <Box
                      p={5}
                      bgColor="#20212C"
                      borderRadius={'12px'}
                      h={'200px'}
                      w={['95%', '95%', '95%', '200px']}
                      style={{ marginInlineStart: '0px', cursor: 'pointer', transition: '0.5s' }}
                      // _hover={{border: '2px solid #fff'}}
                      _hover={{ boxShadow: '0px 0px 8px 2px #FFFFFF' }}
                    >
                      <VStack justifyContent={'space-between'} h={'100%'}>
                        <Tooltip hasArrow label={list.name} placement="top">
                          <Text
                            fontSize={'3xl'}
                            textAlign='center'
                            fontWeight="bold"
                            textOverflow={'ellipsis'}
                            whiteSpace="nowrap"
                            overflow={'hidden'}
                            w={'100%'}
                          >
                            {list.name}
                          </Text>
                        </Tooltip >
                        <HStack w={'100%'} justifyContent={'space-between'}>
                          <VStack alignItems={'start'}>
                            <Text fontSize={['sm', 'md', 'lg']} textAlign='center'>
                              Itens
                            </Text>
                            <Text style={{ marginTop: '0px' }} fontSize={['sm', 'md', 'lg']} textAlign='center' fontWeight="bold">
                              {list.items.length}
                            </Text>
                          </VStack>
                          <VStack alignItems={'start'}>
                            <Text fontSize={['sm', 'md', 'lg']} textAlign='center'>
                              Total
                            </Text>
                            <Text style={{ marginTop: '0px' }} fontSize={['md', 'lg', 'xl']} textAlign='center' fontWeight="bold">
                              {treatCurrency(handlePriceSum(list.items), false)}
                            </Text>
                          </VStack>
                        </HStack>

                      </VStack>

                    </Box>
                  </Link>

                )
              })
            }
          </HStack>
        </Box>
      </Layout>
    </>
  );
};

export default List;
