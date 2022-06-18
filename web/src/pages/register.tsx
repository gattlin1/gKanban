import React from 'react';
import { Form, Formik } from 'formik';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { Box, Button, Link } from '@chakra-ui/react';
import { MeDocument, MeQuery, useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorsMap';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { withApollo } from '../utils/withApollo';

function Register() {
  const router = useRouter();
  const [register] = useRegisterMutation();

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ username: '', password: '', email: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({
            variables: { credentials: values },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: 'Query',
                  me: data?.register.user,
                },
              });
            },
          });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
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
              <InputField name='email' label='Email' placeholder='email' />
            </Box>
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
                Sign Up
              </Button>
              <NextLink href='/login'>
                <Link ml={2} color='teal'>
                  Already have an account? Login here
                </Link>
              </NextLink>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default withApollo({ ssr: false })(Register);
