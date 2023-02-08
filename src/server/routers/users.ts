import { router, publicProcedure } from '../trpc';
import { PrismaClient } from '../../../prisma/src/generated/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { compareSync } from 'bcryptjs';

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
        username: z.string().min(6),
        password: z.string().min(8),
      }),
    )
    .query(async ({ input }) => {
      const user = await prisma.user.findFirst({
        where: {
          username: input.username,
        },
      });
      if (user && compareSync(input.password, user.password)) {
        return user.id;
      }
      return null;
    }),
});
