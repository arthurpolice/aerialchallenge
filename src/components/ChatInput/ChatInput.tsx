import {
  TextInput,
  TextInputProps,
  ActionIcon,
  useMantineTheme,
  Dialog,
  Title,
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
import { ChangeEvent, SetStateAction, useState } from 'react';
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

  const [message, setMessage] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [open, setOpen] = useState<boolean>(false);

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
  const handleEmojiClose = () => {
    setToggleEmoji(false);
  };
  const emojiClick = (emoji) => {
    setMessage((message) => message + emoji.emoji);
    setToggleEmoji(false);
  };
  const loadPicture = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log(files);
    const file = files ? files[0] : null;
    file ? setImage(file) : null;
    setOpen(true);
  };
  const handleDialogClose = () => {
    setOpen(false);
    setImage(null);
  };
  return (
    <>
      <Dialog
        position={{ bottom: 72 }}
        size={300}
        className={styles.dialog}
        opened={open}
        withCloseButton
        onClose={handleDialogClose}
      >
        {image && (
          <img
            src={URL.createObjectURL(image)}
            className={styles.previewImage}
          />
        )}
        <div>
          <Title className={styles.helperText} order={4}>
            You are uploading:
          </Title>
          <Title className={styles.helperText} order={5}>
            {image?.name}
          </Title>
        </div>
      </Dialog>
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
                onChange={loadPicture}
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
                <div
                  className={styles.emojiBoard}
                  onMouseLeave={handleEmojiClose}
                >
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
