import {
  TextInput,
  TextInputProps,
  ActionIcon,
  useMantineTheme,
} from '@mantine/core';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaperPlane,
  faPlus,
  faSmileBeam,
} from '@fortawesome/free-solid-svg-icons';
import styles from './ChatInput.module.css';
import { trpc } from '~/utils/trpc';
import { useState } from 'react';
import { parseCookies } from 'nookies';

export function ChatInput(props: TextInputProps) {
  library.add(faPaperPlane, faPlus, faSmileBeam);
  const theme = useMantineTheme();

  const userId = parseCookies().user_id;

  const utils = trpc.useContext();
  const addMessage = trpc.message.add.useMutation({
    async onSuccess() {
      // refetches messages after a post is added
      await utils.message.list.invalidate();
    },
  });
  const [message, setMessage] = useState('');

  return (
    <div className={styles.inputConsole}>
      <TextInput
        className={styles.input}
        radius="xl"
        size="sm"
        rightSection={
          <div className={styles.buttons}>
            <ActionIcon
              className={styles.plusIcon}
              size={30}
              radius="xl"
              color={theme.primaryColor}
              variant="filled"
            >
              <FontAwesomeIcon icon={faPlus} />
            </ActionIcon>
            <ActionIcon
              size={30}
              radius="xl"
              color={theme.primaryColor}
              variant="filled"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </ActionIcon>
          </div>
        }
        placeholder="Your message..."
        rightSectionWidth={78}
        icon={<FontAwesomeIcon icon={faSmileBeam} className={styles.smile} />}
        {...props}
      />
    </div>
  );
}
