/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from '../trpc';
import { msgRouter } from './messages';
import { userRouter } from './users';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),

  message: msgRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
