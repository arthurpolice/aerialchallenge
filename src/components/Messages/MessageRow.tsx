import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';
import DeleteButton from './DeleteButton';
import styles from './Messages.module.css';
import MessageBox from './MessageBox/MessageBox';

interface Message {
  createdBy: any;
  id: string;
  hasImage: boolean;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string | null;
}

export default function MessageRow({
  message,
}: {
  message: Message;
}): JSX.Element {
  const cookies = parseCookies();
  const cookiesId = cookies.user_id;
  const senderId = message.createdBy.id;
  const hasImage = message.hasImage;
  const [direction, setDirection] = useState('');
  const [rowStyle, setRowStyle] = useState<string | undefined>(
    styles.leftMessage,
  );
  const [preSignedUrl, setPreSignedUrl] = useState<string>('');

  useEffect(() => {
    if (senderId === cookiesId) {
      setDirection('right');
      setRowStyle(styles.rightMessage);
    } else {
      setDirection('left');
    }
  }, [senderId, cookiesId]);

  const getPreSignedUrl = async (key: string | null) => {
    if (key) {
      const apiCall = await fetch(`api/imageGet?key=${key}`);
      const response = await apiCall.json();
      const { url } = response;
      return url;
    }
  };
  useEffect(() => {
    getPreSignedUrl(message.imageUrl)
      .then((response) => response)
      .then((data) => {
        setPreSignedUrl(data);
      });
  });

  if (direction !== '' && !hasImage) {
    return (
      <div className={rowStyle}>
        <MessageBox
          position={direction}
          title={direction === 'right' ? '' : message.createdBy.name}
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
          position={direction}
          title={direction === 'right' ? '' : message.createdBy.name}
          type={'photo'}
          text={message.text}
          date={message.createdAt}
          data={{
            status: {
              autoDownload: true,
              download: true,
              loading: true,
            },
            uri: preSignedUrl,
          }}
        />
        {direction === 'right' && (
          <DeleteButton messageId={message.id} imageUrl={message.imageUrl} />
        )}
      </div>
    );
  } else {
    return <></>;
  }
}
