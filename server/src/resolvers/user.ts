import { User } from '../entities/User';
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { MyContext } from '../types';
import argon2 from 'argon2';
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from '../constants';
import { UsernamePasswordInput } from './UsernamePasswordInput';
import { validateRegister } from '../utils/validateRegister';
import { sendEmail } from '../utils/sendEmail';
import { v4 } from 'uuid';

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    // current user and ok to show email
    if (req.session.userId === user.id) {
      return user.email;
    }

    // not the current user
    return '';
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 3) {
      return {
        errors: [
          {
            field: 'newPassword',
            message: 'password length must be greater than 3 characters',
          },
        ],
      };
    }

    token = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(token);
    if (!userId) {
      return {
        errors: [
          {
            field: 'token',
            message: 'Token Expired',
          },
        ],
      };
    }

    const id = parseInt(userId);
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return {
        errors: [
          {
            field: 'token',
            message: 'user no longer exist',
          },
        ],
      };
    }

    const password = await argon2.hash(newPassword);
    await User.update({ id }, { password });
    redis.del(token);

    // automatically login user
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return true;
    }

    const token = v4();
    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      'EX',
      1000 * 60 * 60 * 24 * 3
    );
    await sendEmail(
      'Gattlin Walker <gattlin28@gmail.com>',
      email,
      'Recover Account',
      'Click the link below to reset your password. If you did not request a password change please ignore this email.',
      `<a href="http://localhost:3000/change-password"/${token}>reset password</a>`
    );
    return true;
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    // you're not logged in
    if (!req.session.userId) return null;

    return User.findOne({ where: { id: req.session.userId } });
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    return User.find();
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('credentials') credentials: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const hashedPassword = await argon2.hash(credentials.password);
    const errors = validateRegister(credentials);
    if (errors) return { errors };

    let user;
    try {
      user = await User.create({
        username: credentials.username,
        password: hashedPassword,
        email: credentials.email,
      }).save();
    } catch (err) {
      if (err.detail.includes('already exists')) {
        console.log(err);
        return {
          errors: [{ field: 'username', message: 'username already exists' }],
        };
      }
    }

    // automatically login user
    req.session.userId = user?.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(
      usernameOrEmail.includes('@')
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
    );

    const credentialsErrorMsg = [
      {
        field: 'usernameOrEmail',
        message: 'login credentials are incorrect',
      },
      {
        field: 'password',
        message: 'login credentials are incorrect',
      },
    ];

    if (!user) {
      return {
        errors: credentialsErrorMsg,
      };
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: credentialsErrorMsg,
      };
    }

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);

        if (err) {
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
