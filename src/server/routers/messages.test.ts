/**
 * Integration test example for the `post` router
 */
import { createContextInner } from '../context';
import { AppRouter, appRouter } from './_app';
import { inferProcedureInput } from '@trpc/server';

test('pagination test', async () => {
  const ctx = await createContextInner({});
  const caller = appRouter.createCaller(ctx);

  const input: inferProcedureInput<AppRouter['message']['list']> = {
    limit: 30,
    cursor: undefined,
  };

  const list = await caller.message.list(input);

  expect(list.nextCursor).toBeDefined();
});
