import { Box, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import EditDeletePostButtons from '../../components/EditDeletePostButtons';
import Layout from '../../components/Layout';
import { useMeQuery } from '../../generated/graphql';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';
import { withApollo } from '../../utils/withApollo';

function Post() {
  const { data, loading, error } = useGetPostFromUrl();
  const { data: meData } = useMeQuery();

  let content = null;
  if (loading) {
    content = <div>Loading...</div>;
  }
  if (data) {
    const id = data.post?.id ? data.post.id : -1;
    content = (
      <Box>
        <Heading mb={4}>{data.post?.title}</Heading>
        <Text mb={4}>{data.post?.text}</Text>
        {meData?.me?.id === data.post?.creator.id && (
          <EditDeletePostButtons id={id} />
        )}
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

export default withApollo({ ssr: true })(Post);
