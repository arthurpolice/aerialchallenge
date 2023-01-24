import styles from './Messages.module.css';
import MessageBox from './MessageBox/MessageBox';

interface Message {
  id: string;
  hasImage: boolean;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function MessageRow({ message }: { message: Message }) {
  return (
    <div>
      <div className={styles.message}>
        <MessageBox
          position="left"
          title="beepboop"
          type="text"
          text={message.text}
          date={message.createdAt}
        />
      </div>
    </div>
  );
}
