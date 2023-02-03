import { router, publicProcedure } from '../trpc';
import { PrismaClient } from '../../../prisma/src/generated/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

const prisma = new PrismaClient();

export const userRouter = router({
  register: publicProcedure
    .input(
      z.object({
        username: z.string().min(6),
        name: z.string(),
        password: z.string().min(8),
      }),
    )
    .mutation(async ({ input }) => {
      await prisma.user.create({
        data: input,
      });
    }),
  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const user = await prisma.user.findFirstOrThrow({
        where: {
          username: input.username,
        },
      });
      return user;
    }),
});
