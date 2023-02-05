import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';
import DeleteButton from './DeleteButton';
import styles from './Messages.module.css';
import MessageBox from './MessageBox/MessageBox';
import { Message } from '../types.d';

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

  // Messages are only rendered upon receiving a direction from this useEffect (is this acceptable practice?)
  // If the message is from the user, it shows up on the right, else on the left
  useEffect(() => {
    if (senderId === cookiesId) {
      setDirection('right');
      setRowStyle(styles.rightMessage);
    } else {
      setDirection('left');
    }
  }, [senderId, cookiesId]);

  // This gets the url to display the image in the message
  const getPreSignedUrl = async (key: string | null) => {
    if (key) {
      const apiCall = await fetch(`api/imageGet?key=${key}`);
      const response = await apiCall.json();
      const { url } = response;
      return url;
    }
  };
  // Use effect to use the above function upon rendering of the message
  useEffect(() => {
    getPreSignedUrl(message.imageUrl)
      .then((response) => response)
      .then((data) => {
        setPreSignedUrl(data);
      });
  }, [message.imageUrl]);

  if (direction !== '' && !hasImage) {
    return (
      <div className={rowStyle}>
        <MessageBox
          id={message.id}
          titleColor={'purple'}
          forwarded={false}
          focus={false}
          replyButton={false}
          removeButton={false}
          status={null}
          notch={true}
          retracted={false}
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
          id={message.id}
          titleColor={'purple'}
          forwarded={false}
          focus={false}
          replyButton={false}
          removeButton={false}
          status={null}
          notch={false}
          retracted={false}
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
