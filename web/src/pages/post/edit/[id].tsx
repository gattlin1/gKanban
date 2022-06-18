import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import InputField from '../../../components/InputField';
import Layout from '../../../components/Layout';
import {
  usePostQuery,
  useUpdatePostMutation,
} from '../../../generated/graphql';
import { useGetIntId } from '../../../utils/useGetIntId';
import { withApollo } from '../../../utils/withApollo';

function EditPost() {
  const router = useRouter();
  const postId = useGetIntId();
  const { data, loading, error } = usePostQuery({
    skip: postId === -1,
    variables: { id: postId },
  });
  const [updatePost] = useUpdatePostMutation();

  let form = null;
  if (loading) {
    form = <Box>Loading...</Box>;
  }
  if (error) {
    form = <Box>error.message</Box>;
  }
  if (data) {
    form = (
      <Formik
        initialValues={{ title: data.post!.title, text: data.post!.text }}
        onSubmit={async (values) => {
          await updatePost({ variables: { id: postId, ...values } });
          router.back();
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
                Update Post
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    );
  }
  if (!data?.post) {
    form = <Box>Could not find post</Box>;
  }

  return <Layout variant='small'>{form}</Layout>;
}

export default withApollo({ ssr: false })(EditPost);
