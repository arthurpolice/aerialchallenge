import MessageRow from './MessageRow';
interface Message {
  createdBy: any;
  id: string;
  hasImage: boolean;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string | null;
}

interface Props {
  list: Message[];
}

export default function Messages({ list }: Props) {
  return (
    <>
      {list.map((message: Message) => {
        return <MessageRow key={message.id} message={message} />;
      })}
    </>
  );
}
