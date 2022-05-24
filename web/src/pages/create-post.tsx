import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import router from 'next/router';
import React from 'react';
import InputField from '../components/InputField';
import Layout from '../components/Layout';
import { useCreatePostMutation } from '../generated/graphql';
import useIsAuth from '../utils/useIsAuth';
import { createUrqlClient } from '../utils/createUrqlClient';

function CreatePost() {
  const [, createPost] = useCreatePostMutation();
  useIsAuth();

  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async (values) => {
          const { error } = await createPost({ input: values });
          if (!error) {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name='title' label='Title' placeholder='Title' />
            <Box mt={4}>
              <InputField
                name='text'
                label='Body'
                placeholder='text...'
                textArea
              />
            </Box>
            <Box mt={4}>
              <Button isLoading={isSubmitting} type='submit' color='teal'>
                Create Post
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: false })(CreatePost);
