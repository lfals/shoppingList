import { Text } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Layout from '../components/layout.component';

interface IList {
  id: string;
  name: string;
}

const List: NextPage = () => {
  return (
    <>
      <Layout></Layout>
    </>
  );
};

export default List;
