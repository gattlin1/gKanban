import React from 'react';
import NavBar from './NavBar';
import Wrapper, { WrapperVariant } from './Wrapper';

interface LayoutProps {
  variant?: WrapperVariant;
  children: JSX.Element | JSX.Element[];
}

function Layout({ variant = 'regular', children }: LayoutProps) {
  return (
    <>
      <NavBar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
}

export default Layout;
