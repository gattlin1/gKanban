import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { Post } from './entities/Post';
import mikroOrmConfig from './mikro-orm.config';

async function main() {
  const orm = await MikroORM.init(mikroOrmConfig);

  await orm.em.nativeInsert(Post, { title: 'my first post 2' });
}

main();
