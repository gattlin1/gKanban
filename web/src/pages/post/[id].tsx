import { Box, Heading, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../../components/Layout';
import { usePostQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';

function Post() {
  const router = useRouter();
  const routerId = router.query.id;
  const id = typeof routerId === 'string' ? parseInt(routerId) : -1;
  const [{ data, fetching, error }] = usePostQuery({
    pause: id === -1,
    variables: { id },
  });

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
