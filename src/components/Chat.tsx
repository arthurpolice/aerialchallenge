import { useState } from 'react';
import { trpc } from '~/utils/trpc';

export default function ChatPage() {
  const utils = trpc.useContext();
  const messageQuery = trpc.message.list.useInfiniteQuery(
    {
      limit: 20,
    },
    {
      getPreviousPageParam(lastPage) {
        return lastPage.nextCursor;
      },
    },
  );

  const addMessage = trpc.message.add.useMutation({
    async onSuccess() {
      // refetches messages after a post is added
      await utils.message.list.invalidate();
    },
  });
  const [message, setMessage] = useState('');

  return <p>Hello World</p>;
}
