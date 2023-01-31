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
import EmojiPicker from 'emoji-picker-react';

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
    if (userId && message !== '') {
      await addMessage.mutateAsync({
        hasImage: true,
        text: message,
        userId: userId,
      });
      setMessage('');
    } else if (!userId) {
      setFunction('login');
    }
  };

  const [toggleEmoji, setToggleEmoji] = useState(false);
  const handleEmojiToggle = () => {
    setToggleEmoji(!toggleEmoji);
  };
  const handleClose = () => {
    setToggleEmoji(false);
  };
  const emojiClick = (emoji) => {
    setMessage((message) => message + emoji.emoji);
    setToggleEmoji(false);
  };

  return (
    <>
      <div className={styles.inputConsole}>
        <TextInput
          className={styles.input}
          radius="xl"
          size="sm"
          value={message}
          onInput={(e) => setMessage(e.currentTarget.value)}
          rightSection={
            <div className={styles.buttons}>
              <input
                type={'file'}
                accept={'image/*'}
                className={styles.hidden}
                id={'image-input'}
              />
              <ActionIcon
                className={styles.plusIcon}
                component={'label'}
                htmlFor="image-input"
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
          icon={
            <>
              {toggleEmoji && (
                <div className={styles.emojiBoard} onMouseLeave={handleClose}>
                  <EmojiPicker
                    onEmojiClick={emojiClick}
                    emojiStyle={'native'}
                  />
                </div>
              )}
              <ActionIcon
                className={styles.smile}
                size={30}
                radius="xl"
                color={theme.primaryColor}
                variant="filled"
                onClick={handleEmojiToggle}
              >
                <FontAwesomeIcon icon={faSmileBeam} />
              </ActionIcon>
            </>
          }
          {...props}
        />
      </div>
    </>
  );
}
