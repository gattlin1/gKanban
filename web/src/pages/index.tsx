import { withUrqlClient } from 'next-urql';
import React from 'react';
import NavBar from '../components/NavBar';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

function Index() {
  const [{ data }] = usePostsQuery();
  return (
    <div>
      <NavBar />
      {data && data.posts.map((p) => <div key={p.id}>{p.title}</div>)}
    </div>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
