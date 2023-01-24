import { trpc } from '~/utils/trpc';
import { ChatInput } from './ChatInput/ChatInput';
import Messages from './Messages/Messages';
import styles from './Messages/Messages.module.css'

export default function ChatPage() {
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

  return (
    <>
      <div className={styles.root}>
        {messageQuery.data?.pages.map((page, index) => {
          return <Messages key={index} list={page.items} />;
        })}
      </div>
      <ChatInput />
    </>
  );
}
