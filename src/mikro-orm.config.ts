import { __prod__ } from './constants';
import { Post } from './entities/Post';
import { MikroORM } from '@mikro-orm/core';
import path from 'path';
import { User } from './entities/User';

export default {
  migrations: {
    path: path.join(__dirname, './migrations'),
    glob: '!(*.d).{js,ts}',
  },
  entities: [Post, User],
  dbName: 'gkanban',
  type: 'postgresql',
  user: 'gattlinwalker',
  password: 'gattlinwalker',
  allowGlobalContext: true,
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
