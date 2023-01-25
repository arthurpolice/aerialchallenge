import React, { SetStateAction, useRef } from 'react';
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
    messageQuery.fetchPreviousPage();
  };

  const dummy = useRef<HTMLDivElement>(null);
  const autoScroll = () => {
    if (dummy.current != null) {
      dummy.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className={styles.root}>
        <div className={styles.main}>
          <InfiniteScroll
            pageStart={0}
            loadMore={getNextPage}
            hasMore={true || false}
            useWindow={true}
            isReverse={true}
          >
            {messageQuery.data?.pages.map((page, index) => {
              return (
                <Messages
                  key={index}
                  list={page.items}
                  autoScroll={autoScroll}
                />
              );
            })}
            <div ref={dummy}></div>
          </InfiniteScroll>
        </div>
      </div>
      <ChatInput setFunction={setFunction} />
    </>
  );
}
