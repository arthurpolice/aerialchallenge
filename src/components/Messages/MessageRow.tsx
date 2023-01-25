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
  userId: string;
}

export default function MessageRow({ message }: { message: Message }) {
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
