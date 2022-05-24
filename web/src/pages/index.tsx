import React from 'react';
import { withUrqlClient } from 'next-urql';
import Layout from '../components/Layout';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';
import { Link } from '@chakra-ui/react';

function Index() {
  const [{ data }] = usePostsQuery();
  return (
    <Layout>
      <NextLink href='/create-post'>
        <Link color='teal'>Create Post</Link>
      </NextLink>
      <div>
        {data && data.posts.map((p) => <div key={p.id}>{p.title}</div>)}
      </div>
    </Layout>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
