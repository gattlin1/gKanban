import { Box } from '@chakra-ui/layout';
import React from 'react';

interface WrapperProps {
  variant: 'small' | 'regular';
  children: JSX.Element;
}

function Wrapper({ children, variant = 'regular' }: WrapperProps) {
  return (
    <Box
      mt={8}
      mx='auto'
      maxW={variant === 'regular' ? '800px' : '400px'}
      w='100%'
    >
      {children}
    </Box>
  );
}

export default Wrapper;
