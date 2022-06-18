import React from 'react';
import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import { useApolloClient } from '@apollo/client';

function NavBar() {
  const { data, loading } = useMeQuery({ skip: isServer() });
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  let user = null;

  if (loading) {
  } else if (!data?.me) {
    user = (
      <>
        <NextLink href='/login'>
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href='/register'>
          <Link>Register</Link>
        </NextLink>
      </>
    );
  } else {
    user = (
      <Flex align='center'>
        <NextLink href='/create-post'>
          <Button as={Link} mr={2}>
            Create Post
          </Button>
        </NextLink>
        <Box mr={4}>{data.me.username}</Box>
        <Button
          variant='link'
          onClick={async () => {
            await logout();
            apolloClient.resetStore();
          }}
          isLoading={logoutFetching}
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex bg='teal' p={4} zIndex={1} position='sticky' top={0}>
      <Flex maxW={800} align='center' flex={1} m='auto'>
        <NextLink href='/'>
          <Link>
            <Heading>LiReddit</Heading>
          </Link>
        </NextLink>
        <Box padding={4} ml='auto'>
          {user}
        </Box>
      </Flex>
    </Flex>
  );
}

export default NavBar;
