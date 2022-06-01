import path from 'path';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  database: 'lireddit',
  username: 'gattlinwalker',
  password: 'gattlinwalker',
  logging: true,
  synchronize: true,
  entities: [path.join(__dirname, './entities/*')],
  migrations: [path.join(__dirname, './migrations/*')],
});
