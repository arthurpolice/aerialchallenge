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
import { ChangeEvent, SetStateAction, useEffect, useState } from 'react';
import { parseCookies } from 'nookies';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

interface HookProps {
  setFunction: React.Dispatch<SetStateAction<string>>;
}

export default function ChatInput(
  { setFunction }: HookProps,
  props: TextInputProps,
): JSX.Element {
  // State
  const [message, setMessage] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [toggleEmoji, setToggleEmoji] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  // Styling
  library.add(faPaperPlane, faPlus, faSmileBeam);
  const theme = useMantineTheme();

  // "Authentication"
  const userId = parseCookies().user_id;
  useEffect(() => (userId ? setLoggedIn(true) : setLoggedIn(false)), [userId]);

  // Brings trpc helpers to the file
  const utils = trpc.useContext();

  // Backend communication
  const addMessage = trpc.message.add.useMutation({
    async onMutate(newMessage) {
      await utils.message.list.cancel();
      const previousMessages = utils.message.list.getInfiniteData({
        limit: 30,
        cursor: undefined,
      });
      console.log(previousMessages);
      if (previousMessages) {
        utils.message.list.setInfiniteData(
          {
            limit: 30,
            cursor: undefined,
          },
          (items) => {
            items?.pages[0]?.items.push({
              ...newMessage,
              id: Math.random().toString(),
              hasImage: false,
              imageUrl: '',
              createdAt: new Date(Date.now()),
              updatedAt: new Date(Date.now()),
              createdBy: {
                id: userId ? userId : Math.random().toString(),
                username: Math.random().toString(),
                password: Math.random().toString(),
                name: '',
              },
            });
            console.log(items);
            return items;
          },
        );
      }

      return { previousMessages };
    },
    onError: (err, newMessage, context) => {
      //utils.message.list.setData({}, context?.previousMessages);
    },
    async onSettled() {
      // refetches messages after a post is added
      await utils.message.list.invalidate();
    },
  });
  const uploadImage = async () => {
    if (image) {
      const fileType = encodeURIComponent(image.type);
      // Call our own API to get the pre-signed URL
      const fetchAwsUrl = await fetch(`api/imageUpload?fileType=${fileType}`);
      const response = await fetchAwsUrl.json();
      const { uploadUrl, key } = response;
      // Send the image to the pre-signed URL
      await fetch(uploadUrl, {
        method: 'PUT',
        mode: 'cors',
        body: image,
      });
      // Return the URL to display the image
      return key;
    }
    return null;
  };

  const handleSubmit = async () => {
    if ((userId && message !== '') || (userId && image)) {
      const imageUrl = await uploadImage();
      await addMessage.mutateAsync({
        hasImage: image ? true : false,
        imageUrl,
        text: message,
        userId: userId,
      });
      setMessage('');
      setImage(null);
      setOpen(false);
    } else if (!userId) {
      setFunction('login');
    }
  };

  // Frontend and state manipulation
  const handleEmojiToggle = () => {
    setToggleEmoji(!toggleEmoji);
  };
  const handleEmojiClose = () => {
    setToggleEmoji(false);
  };
  const emojiClick = (emoji: EmojiClickData) => {
    setMessage((message) => message + emoji.emoji);
    setToggleEmoji(false);
  };
  const handleDialogClose = () => {
    setOpen(false);
    setImage(null);
  };

  const loadPicture = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const file = files ? files[0] : null;
    file ? setImage(file) : null;
    setOpen(true);
  };

  return (
    <>
      <div className={styles.inputConsole}>
        <Dialog
          position={{ bottom: 72, right: 24 }}
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
        <TextInput
          className={styles.input}
          radius="xl"
          size="sm"
          disabled={loggedIn ? false : true}
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
          placeholder={loggedIn ? 'Your message...' : 'Please Log In'}
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
                    lazyLoadEmojis={true}
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
