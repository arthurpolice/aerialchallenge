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
import { SetStateAction, useState } from 'react';
import { parseCookies } from 'nookies';

interface HookProps {
  setFunction: React.Dispatch<SetStateAction<string>>;
}

export default function ChatInput(
  { setFunction }: HookProps,
  props: TextInputProps,
) {
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

  const handleSubmit = async () => {
    if (userId) {
      await addMessage.mutateAsync({
        hasImage: false,
        text: message,
        userId: userId,
      });
      setMessage('');
    } else {
      setFunction('login');
    }
  };

  return (
    <div className={styles.inputConsole}>
      <TextInput
        className={styles.input}
        radius="xl"
        size="sm"
        value={message}
        onInput={(e) => setMessage(e.currentTarget.value)}
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
              onClick={handleSubmit}
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
