import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface DataResponseProps {
  id: string;
  title: string;
  description: string;
  url: string;
  ts: number;
}

interface ResponseProps {
  data: DataResponseProps[];
  after: string;
}

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    async ({ pageParam = 0 }): Promise<ResponseProps> => {
      const response = await api.get('/api/images', {
        params: {
          after: pageParam,
        },
      });

      return response.data;
    },
    {
      getNextPageParam: res => {
        const { after } = res;

        return after || null;
      },
    }
  );

  const formattedData = useMemo(() => {
    return data ? data.pages.map(page => page.data).flat(2) : null;
  }, [data]);

  // TODO RENDER LOADING SCREEN
  if (isLoading) {
    return (
      <>
        <Header />
        <Loading />
      </>
    );
  }

  // TODO RENDER ERROR SCREEN
  if (isError) {
    return (
      <>
        <Header />
        <Error />
      </>
    );
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Box marginTop="2rem" borderTopWidth="1px" borderTopColor="gray.500">
            <Button onClick={() => fetchNextPage()}>
              {isFetchingNextPage ? 'Carregando' : 'Carregar mais'}
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
}
