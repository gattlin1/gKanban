import { Box, Button, Link, useDisclosure } from '@chakra-ui/react';
import NextLink from 'next/link';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import InputField from '../../components/InputField';
import Wrapper from '../../components/Wrapper';
import { toErrorMap } from '../../utils/toErrorsMap';
import {
  MeDocument,
  MeQuery,
  useChangePasswordMutation,
} from '../../generated/graphql';
import Modal from '../../components/Modal';
import { withApollo } from '../../utils/withApollo';

function ChangePassword() {
  const router = useRouter();
  const [changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Wrapper variant='small'>
        <Formik
          initialValues={{ newPassword: '', confirmNewPassword: '' }}
          onSubmit={async (
            { newPassword, confirmNewPassword },
            { setErrors }
          ) => {
            if (newPassword !== confirmNewPassword) {
              setErrors({ confirmNewPassword: 'passwords do not match' });
              return;
            }

            const response = await changePassword({
              variables: {
                newPassword,
                token:
                  typeof router.query.token === 'string'
                    ? router.query.token
                    : '',
              },
              update: (cache, { data }) => {
                cache.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: {
                    __typename: 'Query',
                    me: data?.changePassword.user,
                  },
                });
              },
            });

            if (response.data?.changePassword.errors) {
              const errorMap = toErrorMap(response.data.changePassword.errors);
              if ('token' in errorMap) {
                setTokenError(errorMap.token);
                onOpen();
              }
              setErrors(errorMap);
            } else if (response.data?.changePassword.user) {
              router.push('/');
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name='newPassword'
                label='New Password'
                placeholder='New Password'
                type='password'
              />
              <Box mt={4}>
                <InputField
                  name='confirmNewPassword'
                  label='Confirm Password'
                  placeholder='Confirm Password'
                  type='password'
                />
              </Box>
              <Box mt={4}>
                <Button isLoading={isSubmitting} type='submit' color='teal'>
                  Change Password
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Wrapper>
      <Modal header={tokenError} isOpen={isOpen} onClose={onClose}>
        <>
          The password reset link has expired. Please request another password
          change.
          <Box mt={4}>
            <NextLink href='/forgot-password'>
              <Link color='teal'>Reset Password</Link>
            </NextLink>
          </Box>
        </>
      </Modal>
    </>
  );
}

export default withApollo({ ssr: false })(ChangePassword);
