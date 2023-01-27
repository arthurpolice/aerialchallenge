import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { trpc } from '~/utils/trpc';
import ChatInput from './ChatInput/ChatInput';
import MessageRow from './Messages/MessageRow';
import styles from './Messages/Messages.module.css';

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
  }

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
  const [messageAmount, setMessageAmount] = useState(20);

  const getNextPage = async () => {
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
        if (yOffsetDifference && yOffsetDifference > -600) {
          dummy.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  let previousY;
  const onScroll = (event: any) => {
    const newY = event.currentTarget.scrollTop;
    if (newY < 2500 && newY < previousY) {
      setMessageAmount((amount) => amount + 10);
      getNextPage();
    }
    previousY = newY;
  };

  const main = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (main && main.current) {
      main.current.scrollTop = main.current.scrollHeight;
    }
  }, []);
  const flattenedList = messageQuery.data?.pages.flatMap((page) => page.items);
  const messagesToRender = flattenedList?.slice(0, messageAmount);
  return (
    <>
      <div className={styles.root}>
        <div
          className={styles.main}
          onWheel={(e) => onScroll(e)}
          onScroll={(e) => onScroll(e)}
          ref={main}
        >
          {messagesToRender?.map((message: Message) => {
            return (
              <MessageRow
                key={message.id}
                message={message}
                autoScroll={autoScroll}
              />
            );
          })}
          <div ref={dummy}></div>
        </div>
      </div>
      <ChatInput setFunction={setFunction} />
    </>
  );
}
