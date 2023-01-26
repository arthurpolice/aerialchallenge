import React, { SetStateAction, useRef } from 'react';
import { trpc } from '~/utils/trpc';
import ChatInput from './ChatInput/ChatInput';
import Messages from './Messages/Messages';
import styles from './Messages/Messages.module.css';

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
    if (dummy.current) {
      const parentNode = dummy.current.parentElement;
      if (parentNode) {
        const yOffsetDifference =
          parentNode.scrollTop +
          parentNode.clientHeight -
          parentNode.scrollHeight;
        console.log(yOffsetDifference);
        if (yOffsetDifference && yOffsetDifference > -600) {
          console.log('it worked');
          dummy.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };
  const onScroll = (event: any) => {
    if (event.currentTarget.scrollTop === 0) {
      getNextPage();
    }
  };
  return (
    <>
      <div className={styles.root}>
        <div
          className={styles.main}
          onWheel={(e) => onScroll(e)}
          onScroll={(e) => onScroll(e)}
        >
          {messageQuery.data?.pages.map((page, index) => {
            return (
              <Messages key={index} list={page.items} autoScroll={autoScroll} />
            );
          })}
          <div ref={dummy}></div>
        </div>
      </div>
      <ChatInput setFunction={setFunction} />
    </>
  );
}
