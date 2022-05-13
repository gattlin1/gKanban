import React from 'react';
import { Form, Formik } from 'formik';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { values } from 'lodash';
import Wrapper from '../components/Wrapper';

function Register() {
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={(values) => console.log(values)}
      >
        {({ values, handleChange }) => (
          <Form>
            <FormControl>
              <FormLabel htmlFor='username'>Username</FormLabel>
              <Input
                value={values.username}
                onChange={handleChange}
                id='username'
                placeholder='Username...'
              ></Input>
            </FormControl>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default Register;
