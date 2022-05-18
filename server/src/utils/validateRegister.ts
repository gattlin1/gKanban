import { UsernamePasswordInput } from 'src/resolvers/UsernamePasswordInput';

export function validateRegister(credentials: UsernamePasswordInput) {
  if (credentials.username.length <= 2) {
    return [
      {
        field: 'username',
        message: 'username length must be greater than 2 characters',
      },
    ];
  }

  if (credentials.username.includes('@')) {
    return [
      {
        field: 'username',
        message: 'cannot include an "@" sign',
      },
    ];
  }

  if (credentials.password.length <= 3) {
    return [
      {
        field: 'password',
        message: 'password length must be greater than 3 characters',
      },
    ];
  }

  if (!credentials.email.includes('@')) {
    return [
      {
        field: 'email',
        message: 'invalid email',
      },
    ];
  }
  return null;
}
