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
  const hasImage = message.hasImage;
  const [direction, setDirection] = useState('');

  useEffect(() => {
    if (senderId === cookiesId) {
      setDirection('right');
    } else {
      setDirection('left');
    }
  }, [senderId, cookiesId]);

  if (direction !== '' && !hasImage) {
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
  } else if (direction !== '' && hasImage) {
    // Get the image from S3
    return (
      <div className={styles.message}>
        <MessageBox
          position={direction}
          title={message.createdBy.name}
          type={'photo'}
          text={message.text}
          date={message.createdAt}
          data={{
            status: {
              autoDownload: true,
              download: true,
              loading: 1,
            },
            uri: 'https://media.tenor.com/x8v1oNUOmg4AAAAd/rickroll-roll.gif',
          }}
        />
      </div>
    );
  }
}
