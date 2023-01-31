import { router, publicProcedure } from '../trpc';
import { Prisma } from '../../../prisma/src/generated/client';
import { PrismaClient } from '../../../prisma/src/generated/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

const defaultMessageSelect = Prisma.validator<Prisma.MessageSelect>()({
  id: true,
  text: true,
  createdAt: true,
  updatedAt: true,
  hasImage: true,
  createdBy: true,
});

const prisma = new PrismaClient();

export const msgRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;

      const items = await prisma.message.findMany({
        select: defaultMessageSelect,
        // get an extra item at the end which we'll use as next cursor
        take: limit + 1,
        where: {},
        cursor: cursor
          ? {
              id: cursor,
            }
          : undefined,
        orderBy: {
          createdAt: 'desc',
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        // Remove the last item and use it as next cursor

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const nextItem = items.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        items: items.reverse(),
        nextCursor,
      };
    }),
  add: publicProcedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
        text: z.string().min(1),
        hasImage: z.boolean().optional(),
        imageUrl: z.string().optional(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      if (input.hasImage) {
      }
      const message = await prisma.message.create({
        data: input,
        select: defaultMessageSelect,
      });
      return message;
    }),
  delete: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    await prisma.message.delete({
      where: {
        id: input,
      },
    });
  }),
});
