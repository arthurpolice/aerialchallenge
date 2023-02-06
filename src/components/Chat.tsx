import React, { SetStateAction } from 'react';
import { trpc } from '~/utils/trpc';
import ChatInput from './ChatInput/ChatInput';
import MessageRow from './Messages/MessageRow';
import styles from './Messages/Messages.module.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Message } from './types.d';
import { prisma } from '~/server/prisma';

export default function ChatPage({
  setFunction,
}: {
  setFunction: React.Dispatch<SetStateAction<string>>;
}) {
  const utils = trpc.useContext();
  // Get paginated data from backend
  const messageQuery = trpc.message.list.useInfiniteQuery(
    {
      limit: 30,
    },
    {
      getPreviousPageParam(lastPage) {
        return lastPage.nextCursor;
      },
    },
  );

  const getNextPage = async () => {
    messageQuery.fetchPreviousPage();
  };

  const onScroll = () => {
    getNextPage();
  };
  const messages = utils.message.list.getInfiniteData({
    limit: 30,
    cursor: undefined,
  });

  // This flatmap makes the experience smoother. If messageQuery is used for generating the JSX, it keeps jumping around when the pagination gets triggered. (Don't fully understand why)
  const flattenedList = messages?.pages.flatMap((page) => page.items);
  // A little hacky but was the only way I found to make flattened list re-render. Not sure why.
  const refresher = messageQuery.data?.pages.length;
  return (
    <>
      <div className={styles.root}>
        <div id="main" className={styles.main}>
          <InfiniteScroll
            dataLength={flattenedList ? flattenedList.length : 0}
            next={onScroll}
            hasMore={true}
            loader={<></>}
            inverse={true}
            scrollableTarget="main"
            scrollThreshold={'1000px'}
          >
            {flattenedList?.map((message: Message) => {
              return <MessageRow key={message.id} message={message} />;
            })}
          </InfiniteScroll>
        </div>
      </div>
      <ChatInput setFunction={setFunction} />
    </>
  );
}
