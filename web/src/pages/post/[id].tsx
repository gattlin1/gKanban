import { Box, Heading, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import Layout from '../../components/Layout';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';

function Post() {
  const [{ data, fetching, error }] = useGetPostFromUrl();

  let content = null;
  if (fetching) {
    content = <div>Loading...</div>;
  }
  if (data) {
    content = (
      <Box>
        <Heading mb={4}>{data.post?.title}</Heading>
        <Text>{data.post?.text}</Text>
      </Box>
    );
  }
  if (!data?.post) {
    content = <Box>Could not find post</Box>;
  }
  if (error) {
    content = error.message;
  }

  return <Layout>{content}</Layout>;
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
