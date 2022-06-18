import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import InputField from '../components/InputField';
import Modal from '../components/Modal';
import Wrapper from '../components/Wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';

function ForgotPassword() {
  const [complete, setComplete] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  const router = useRouter();
  return (
    <>
      <Wrapper variant='small'>
        <Formik
          initialValues={{ email: '' }}
          onSubmit={async (values) => {
            await forgotPassword({ variables: values });
            setComplete(true);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name='email'
                label='Enter in Email to Reset Password'
                placeholder='Email'
              />
              <Box mt={4}>
                <Button isLoading={isSubmitting} type='submit' color='teal'>
                  Request Password Change
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Wrapper>
      <Modal
        header='Email Sent'
        onClose={() => router.push('/')}
        isOpen={complete}
      >
        A password reset link has been sent if a user with that email exists.
      </Modal>
    </>
  );
}

export default withApollo({ ssr: false })(ForgotPassword);
