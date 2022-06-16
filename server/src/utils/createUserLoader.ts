import Dataloader from 'dataloader';
import { In } from 'typeorm';
import { User } from '../entities/User';

export const createUserLoader = () =>
  new Dataloader<number, User>(async (userIds) => {
    const users = await User.findBy({ id: In(userIds as number[]) });
    const userIdToUser: Record<number, User> = {};
    users.forEach((u) => {
      userIdToUser[u.id] = u;
    });

    return userIds.map((userId) => userIdToUser[userId]);
  });
