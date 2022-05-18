import { User } from '../entities/User';
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import { MyContext } from '../types';
import argon2 from 'argon2';
import { COOKIE_NAME } from '../constants';

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

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

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: MyContext) {
    // you're not logged in
    if (!req.session.userId) return null;

    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Query(() => [User])
  async users(@Ctx() { em }: MyContext): Promise<User[]> {
    return em.find(User, {});
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('credentials') credentials: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (credentials.username.length <= 2) {
      return {
        errors: [
          {
            field: 'username',
            message: 'username length must be greater than 2 characters',
          },
        ],
      };
    }

    if (credentials.password.length <= 3) {
      return {
        errors: [
          {
            field: 'password',
            message: 'password length must be greater than 3 characters',
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(credentials.password);
    const user = em.create(User, {
      username: credentials.username,
      password: hashedPassword,
    });
    try {
      await em.persistAndFlush(user);
    } catch (err) {
      if (err.detail.includes('already exists')) {
        return {
          errors: [{ field: 'username', message: 'username already exists' }],
        };
      }
    }

    // automatically login user
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('credentials') credentials: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, {
      username: credentials.username,
    });

    const credentialsErrorMsg = [
      { field: 'username', message: 'username or password is incorrect' },
    ];
    if (!user) {
      return {
        errors: credentialsErrorMsg,
      };
    }

    const valid = await argon2.verify(user.password, credentials.password);
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
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
