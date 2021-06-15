import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery, useQueryClient } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  const axiosImages: any = ({ pageParam = null }) =>
    api.get(`/api/images`, {
      params: {
        after: pageParam,
      },
    });

  const queryClient = useQueryClient();
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', axiosImages, {
    getNextPageParam: (lastPage: any, pages) => {
      return lastPage.data.after;
    },
    staleTime: 1000,
  });

  const formattedData = useMemo(() => {
    return data?.pages.flatMap((item: any) => {
      return item.data.data;
    });
  }, [data]);

  // TODO RENDER LOADING SCREEN
  if (isLoading) {
    return <Loading />;
  }

  // TODO RENDER ERROR SCREEN
  if (isError) {
    return <Error />;
  }

  function teste(): void {
    queryClient.invalidateQueries('images');
    fetchNextPage();
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        <Button
          as="button"
          onClick={() => teste()}
          role="button"
          aria-roledescription="button"
          disabled={!isFetchingNextPage}
        >
          {hasNextPage ? 'Carregar mais' : 'Carregando'}
        </Button>
      </Box>
    </>
  );
}
