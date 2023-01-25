import styles from './Messages.module.css';
import MessageBox from './MessageBox/MessageBox';
import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';

interface Message {
  createdBy: any;
  id: string;
  hasImage: boolean;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Props {
  message: Message;
  autoScroll: () => void;
}

export default function MessageRow({
  message,
  autoScroll,
}: Props): JSX.Element | undefined {
  const cookies = parseCookies();
  const cookiesId = cookies.user_id;
  const senderId = message.createdBy.id;
  const [direction, setDirection] = useState('');

  useEffect(() => {
    if (senderId === cookiesId) {
      setDirection('right');
    } else {
      setDirection('left');
    }
  }, [senderId, cookiesId]);

  useEffect(() => {
    autoScroll();
  });

  if (direction !== '') {
    return (
      <div className={styles.message}>
        <MessageBox
          position={direction}
          title={message.createdBy.name}
          type="text"
          text={message.text}
          date={message.createdAt}
        />
      </div>
    );
  }
}
