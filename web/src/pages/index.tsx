import React, { useState } from 'react';
import { withUrqlClient } from 'next-urql';
import Layout from '../components/Layout';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';

function Index() {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });

  const [{ data, fetching }] = usePostsQuery({ variables });

  if (!fetching && !data) {
    return <div>your query failed</div>;
  }

  return (
    <Layout>
      <Flex mb={4} align='center'>
        <Heading>LiReddit</Heading>
        <NextLink href='/create-post'>
          <Link ml='auto' color='teal'>
            Create Post
          </Link>
        </NextLink>
      </Flex>
      {data && (
        <Stack spacing={8}>
          {data.posts.map((p) => (
            <Box key={p.id} p={5} shadow='md' borderWidth='1px'>
              <Heading fontSize='xl'>{p.title}</Heading>
              <Text mt={4}>{p.textSnippet}</Text>
            </Box>
          ))}
          <Flex>
            <Button
              onClick={() => {
                setVariables({
                  limit: variables.limit,
                  cursor: data.posts[data.posts.length - 1].createdAt,
                });
              }}
              isLoading={fetching}
              m='auto'
              my={8}
            >
              Load More
            </Button>
          </Flex>
        </Stack>
      )}
    </Layout>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
