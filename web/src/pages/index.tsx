import React from 'react';
import Layout from '../components/Layout';
import { PostsQuery, useMeQuery, usePostsQuery } from '../generated/graphql';
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
import UpdootSection from '../components/UpdootSection';
import EditDeletePostButtons from '../components/EditDeletePostButtons';
import { withApollo } from '../utils/withApollo';

function Index() {
  const { data, error, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 15,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });
  const { data: meData } = useMeQuery();

  if (!loading && !data) {
    return (
      <div>
        <div>your query failed</div>
        <div>{error?.message}</div>
      </div>
    );
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
                      <EditDeletePostButtons id={p.id} />
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
              fetchMore<PostsQuery>({
                variables: {
                  limit: variables?.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
                updateQuery: (prevValues, { fetchMoreResult }): PostsQuery => {
                  if (!fetchMoreResult) return prevValues;
                  return {
                    __typename: 'Query',
                    posts: {
                      __typename: 'PaginatedPosts',
                      hasMore: fetchMoreResult.posts.hasMore,
                      posts: [...fetchMoreResult.posts.posts],
                    },
                  };
                },
              });
            }}
            isLoading={loading}
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

export default withApollo({ ssr: true })(Index);
