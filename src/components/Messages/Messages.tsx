import MessageRow from './MessageRow';
import styles from './Messages.module.css';

interface Message {
  id: string;
  hasImage: boolean;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function Messages({ list }: { list: Message[] }) {
  return (
    <div className={styles.main}>
      {list.map((message: Message) => {
        return <MessageRow key={message.id} message={message} />;
      })}
    </div>
  );
}
