/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from '../trpc';
import { msgRouter } from './messages';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),

  message: msgRouter,
});

export type AppRouter = typeof appRouter;
