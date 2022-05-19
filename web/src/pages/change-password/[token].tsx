import { Box, Button, Link, useDisclosure } from '@chakra-ui/react';
import NextLink from 'next/link';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import React, { useState } from 'react';
import InputField from '../../components/InputField';
import Wrapper from '../../components/Wrapper';
import { toErrorMap } from '../../utils/toErrorsMap';
import { useChangePasswordMutation } from '../../generated/graphql';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import Modal from '../../components/Modal';

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const router = useRouter();
  const [_, changePassword] = useChangePasswordMutation();
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
              newPassword,
              token,
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
};

ChangePassword.getInitialProps = ({ query }) => {
  return { token: query.token as string };
};

export default withUrqlClient(createUrqlClient, { ssr: false })(ChangePassword);
