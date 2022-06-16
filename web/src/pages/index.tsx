import React, { useState } from 'react';
import { withUrqlClient } from 'next-urql';
import Layout from '../components/Layout';
import {
  useDeletePostMutation,
  useMeQuery,
  usePostsQuery,
} from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import UpdootSection from '../components/UpdootSection';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

function Index() {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });

  const [{ data, fetching }] = usePostsQuery({ variables });
  const [, deletePost] = useDeletePostMutation();
  const [{ data: meData }] = useMeQuery();

  if (!fetching && !data) {
    return <div>your query failed</div>;
  }

  return (
    <Layout>
      {data && (
        <Stack spacing={8}>
          {data.posts.posts.map((p) =>
            !p ? null : (
              <Flex key={p.id} p={5} shadow='md' borderWidth='1px'>
                <UpdootSection
                  postId={p.id}
                  points={p.points}
                  voteStatus={p.voteStatus}
                />
                <Box width='100vw'>
                  <Flex>
                    <Box flex={1}>
                      <NextLink href='/post/[id]' as={`/post/${p.id}`}>
                        <Link mr={2}>
                          <Heading fontSize='xl'>{p.title}</Heading>
                        </Link>
                      </NextLink>
                    </Box>
                    {meData?.me?.id === p.creator.id && (
                      <Box mb={1} ml='auto'>
                        <NextLink
                          href='/post/edit/[id]'
                          as={`/post/edit/${p.id}`}
                        >
                          <IconButton
                            as={Link}
                            variant='solid'
                            aria-label='edit post'
                            mr={2}
                            icon={<EditIcon />}
                          />
                        </NextLink>
                        <IconButton
                          variant='solid'
                          aria-label='delete post'
                          icon={
                            <DeleteIcon
                              onClick={() => {
                                deletePost({ id: p.id });
                              }}
                            />
                          }
                        />
                      </Box>
                    )}
                  </Flex>
                  <Text>Posted by: {p.creator.username}</Text>
                  <Text mt={4}>{p.textSnippet}</Text>
                </Box>
              </Flex>
            )
          )}
        </Stack>
      )}

      {data?.posts?.hasMore && (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
            isLoading={fetching}
            m='auto'
            my={8}
          >
            Load More
          </Button>
        </Flex>
      )}
    </Layout>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
