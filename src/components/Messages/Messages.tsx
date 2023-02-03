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
// This component is not being used at the moment, haven't deleted it yet because it may be needed
export default function Messages({ list }: Props) {
  return (
    <>
      {list.map((message: Message) => {
        return <MessageRow key={message.id} message={message} />;
      })}
    </>
  );
}
