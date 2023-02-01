import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionIcon } from '@mantine/core';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import styles from './Messages.module.css';

export default function DeleteButton() {
  library.add(faTrashCan);
  return (
    <ActionIcon
      className={styles.deleteButton}
      radius="xl"
      variant="filled"
      color="red"
    >
      <FontAwesomeIcon icon={faTrashCan} />
    </ActionIcon>
  );
}
