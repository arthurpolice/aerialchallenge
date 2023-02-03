import React, { SetStateAction } from 'react';
import { trpc } from '~/utils/trpc';
import ChatInput from './ChatInput/ChatInput';
import MessageRow from './Messages/MessageRow';
import styles from './Messages/Messages.module.css';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function ChatPage({
  setFunction,
}: {
  setFunction: React.Dispatch<SetStateAction<string>>;
}) {
  interface Message {
    createdBy: any;
    id: string;
    hasImage: boolean;
    text: string;
    createdAt: Date;
    updatedAt: Date;
    imageUrl: string | null;
  }
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
  // This flatmap makes the experience smoother. If messageQuery is used for generating the JSX, it keeps jumping around when the pagination gets triggered. (Don't fully understand why)
  const flattenedList = messageQuery.data?.pages.flatMap((page) => page.items);
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
