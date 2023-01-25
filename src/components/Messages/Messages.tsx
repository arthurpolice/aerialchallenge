import { useEffect } from 'react';
import MessageRow from './MessageRow';
interface Message {
  createdBy: any;
  id: string;
  hasImage: boolean;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Props {
  list: Message[];
  autoScroll: () => void;
}

export default function Messages({ list, autoScroll }: Props) {
  return (
    <div>
      {list.map((message: Message) => {
        return (
          <MessageRow
            key={message.id}
            message={message}
            autoScroll={autoScroll}
          />
        );
      })}
    </div>
  );
}
