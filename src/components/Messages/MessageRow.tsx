import styles from './Messages.module.css';
import MessageBox from './MessageBox/MessageBox';
import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';
import { trpc } from '~/utils/trpc';
import DeleteButton from './DeleteButton';

interface Message {
  createdBy: any;
  id: string;
  hasImage: boolean;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string;
}

export default function MessageRow({
  message,
}: {
  message: Message;
}): JSX.Element | undefined {
  const cookies = parseCookies();
  const cookiesId = cookies.user_id;
  const senderId = message.createdBy.id;
  const hasImage = message.hasImage;
  const [direction, setDirection] = useState('');
  const [rowStyle, setRowStyle] = useState<string | undefined>(
    styles.leftMessage,
  );

  useEffect(() => {
    if (senderId === cookiesId) {
      setDirection('right');
      setRowStyle(styles.rightMessage);
    } else {
      setDirection('left');
    }
  }, [senderId, cookiesId]);

  if (direction !== '' && !hasImage) {
    return (
      <div className={rowStyle}>
        <MessageBox
          position={direction}
          title={message.createdBy.name}
          type="text"
          text={message.text}
          date={message.createdAt}
        />
        {direction === 'right' && (
          <DeleteButton messageId={message.id} imageUrl={message.imageUrl} />
        )}
      </div>
    );
  } else if (direction !== '' && hasImage) {
    return (
      <div className={rowStyle}>
        <MessageBox
          onClick={() => deleteMessage(message.id)}
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
            uri: `https://aerialchallenge.s3.amazonaws.com/${message.imageUrl}`,
          }}
        />
        {direction === 'right' && <DeleteButton />}
      </div>
    );
  }
}
