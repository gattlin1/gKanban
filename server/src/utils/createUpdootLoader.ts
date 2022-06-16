import DataLoader from 'dataloader';
import { Updoot } from '../entities/Updoot';
import { In } from 'typeorm';

export const createUpdootLoader = () =>
  new DataLoader<{ postId: number; userId: number }, Updoot | null>(
    async (keys) => {
      const updoots = await Updoot.findBy({
        postId: In(keys.map((key) => key.postId)),
        userId: In(keys.map((key) => key.userId)),
      });
      const updootIdsToUpdoot: Record<string, Updoot> = {};
      updoots.forEach((updoot) => {
        updootIdsToUpdoot[`${updoot.userId}|${updoot.postId}`] = updoot;
      });

      return keys.map(
        (key) => updootIdsToUpdoot[`${key.userId}|${key.postId}`]
      );
    }
  );
