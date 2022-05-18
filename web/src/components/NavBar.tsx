import React from 'react';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

function NavBar() {
  const [{ data, fetching }] = useMeQuery({ pause: isServer() });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  let user = null;

  if (fetching) {
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
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          variant='link'
          onClick={() => logout()}
          isLoading={logoutFetching}
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex bg='teal' p={4}>
      <Box padding={4} ml='auto'>
        {user}
      </Box>
    </Flex>
  );
}

export default NavBar;
