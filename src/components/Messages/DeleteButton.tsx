import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionIcon } from '@mantine/core';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import styles from './Messages.module.css';
import { trpc } from '~/utils/trpc';

interface Props {
  imageUrl: string | null;
  messageId: string;
}

export default function DeleteButton({ imageUrl, messageId }: Props) {
  library.add(faTrashCan);

  // Backend communication
  const utils = trpc.useContext();
  const removeMessage = trpc.message.delete.useMutation({
    async onSuccess() {
      // refetches messages after a post is removed
      await utils.message.list.invalidate();
      if (imageUrl) {
        // Delete the image from S3, if it exists
        await fetch(`api/imageDelete?key=${imageUrl}`);
      }
    },
  });

  const deleteMessage = async (messageId: string) => {
    await removeMessage.mutateAsync(messageId);
  };

  return (
    <ActionIcon
      className={styles.deleteButton}
      radius="xl"
      variant="filled"
      color="red"
      onClick={() => deleteMessage(messageId)}
    >
      <FontAwesomeIcon icon={faTrashCan} />
    </ActionIcon>
  );
}
