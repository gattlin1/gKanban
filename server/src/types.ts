import { Request, Response } from 'express';
import { Redis } from 'ioredis';

import 'express-session';
import { createUserLoader } from './utils/createUserLoader';
declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

export type MyContext = {
  req: Request;
  res: Response;
  redis: Redis;
  userLoader: ReturnType<typeof createUserLoader>;
};
