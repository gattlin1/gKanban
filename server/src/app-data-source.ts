import path from 'path';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  logging: true,
  synchronize: true,
  entities: [path.join(__dirname, './entities/*')],
  migrations: [path.join(__dirname, './migrations/*')],
});
