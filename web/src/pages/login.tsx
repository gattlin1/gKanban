import React from 'react';
import { Form, Formik } from 'formik';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { Box, Button, Link } from '@chakra-ui/react';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorsMap';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { createUrqlClient } from '../utils/createUrqlClient';
import { withUrqlClient } from 'next-urql';

function Login() {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({ credentials: values });
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='username'
              label='Username'
              placeholder='Username'
            />
            <Box mt={4}>
              <InputField
                name='password'
                label='Password'
                placeholder='Password'
                type='password'
              />
            </Box>
            <Box mt={4}>
              <Button isLoading={isSubmitting} type='submit' color='teal'>
                Login
              </Button>
              <NextLink href='/register'>
                <Link ml={2} color='teal'>
                  Don't have an account? Register here
                </Link>
              </NextLink>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default withUrqlClient(createUrqlClient)(Login);
