import { trpc } from '../utils/trpc';
import { useEffect, useState } from 'react';
import LoginPage from '~/components/LoginPage';

const IndexPage = () => {
  const utils = trpc.useContext();
  const messageQuery = trpc.message.list.useInfiniteQuery(
    {
      limit: 5,
    },
    {
      getPreviousPageParam(lastPage) {
        return lastPage.nextCursor;
      },
    },
  );

  const addMessage = trpc.message.add.useMutation({
    async onSuccess() {
      // refetches posts after a post is added
      await utils.message.list.invalidate();
    },
  });

  const [message, setMessage] = useState('')

  return (
    <LoginPage/>
  )
};

export default IndexPage;

/**
 * If you want to statically render this page
 * - Export `appRouter` & `createContext` from [trpc].ts
 * - Make the `opts` object optional on `createContext()`
 *
 * @link https://trpc.io/docs/ssg
 */
// export const getStaticProps = async (
//   context: GetStaticPropsContext<{ filter: string }>,
// ) => {
//   const ssg = createProxySSGHelpers({
//     router: appRouter,
//     ctx: await createContext(),
//   });
//
//   await ssg.post.all.fetch();
//
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       filter: context.params?.filter ?? 'all',
//     },
//     revalidate: 1,
//   };
// };
