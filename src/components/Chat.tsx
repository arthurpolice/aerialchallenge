import { SetStateAction } from 'react';
import { trpc } from '~/utils/trpc';
import ChatInput from './ChatInput/ChatInput';
import Messages from './Messages/Messages';
import styles from './Messages/Messages.module.css';
import InfiniteScroll from 'react-infinite-scroller';

export default function ChatPage({
  setFunction,
}: {
  setFunction: React.Dispatch<SetStateAction<string>>;
}) {
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

  const getNextPage = () => {
    return messageQuery.fetchPreviousPage();
  };

  return (
    <>
      <div className={styles.root}>
        <InfiniteScroll
          pageStart={0}
          loadMore={getNextPage}
          hasMore={true || false}
          loader={
            <div className="loader" key={0}>
              Loading ...
            </div>
          }
          useWindow={true}
          isReverse={true}
        >
          {messageQuery.data?.pages.map((page, index) => {
            return <Messages key={index} list={page.items} />;
          })}
        </InfiniteScroll>
      </div>
      <ChatInput setFunction={setFunction} />
    </>
  );
}
