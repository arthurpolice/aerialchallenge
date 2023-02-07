import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Anchor,
  Stack,
} from '@mantine/core';
import { trpc } from '~/utils/trpc';
import { SetStateAction, useState } from 'react';
import { setCookie } from 'nookies';
import bcrypt from 'bcryptjs';

interface LoginProps {
  setFunction: React.Dispatch<SetStateAction<string>>;
}

export function AuthenticationForm(
  { setFunction }: LoginProps,
  props: PaperProps,
) {
  const [usernameError, setUsernameError] = useState<null | string>(null);
  const registerUser = trpc.user.register.useMutation({
    onError() {
      setUsernameError('This username is taken.');
    },
  });
  const utils = trpc.useContext();

  const [type, toggle] = useToggle(['login', 'register']);
  const form = useForm({
    initialValues: {
      username: '',
      name: '',
      password: '',
    },
    // Fix the terms validation
    validate: {
      username: (val) =>
        val.length <= 6
          ? 'Username should include at least 6 characters'
          : null,
      password: (val) =>
        val.length <= 8
          ? 'Password should include at least 8 characters'
          : null,
    },
  });

  interface Values {
    username: string;
    name: string;
    password: string;
  }

  const handleSubmit = async (values: Values) => {
    let id;
    if (type !== 'login') {
      await registerUser.mutateAsync({
        name: values.name,
        username: values.username,
        password: bcrypt.hashSync(values.password),
      });
    }
    const fetchId = await utils.user.login.fetch({
      username: values.username,
      password: values.password,
    });
    if (fetchId) {
      id = fetchId;
    }
    if (id) {
      setCookie(null, 'user_id', id, {
        maxAge: 24 * 60 * 60,
      });
      setFunction('chat');
    }
  };
  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <Text size="lg" weight={500}>
        Welcome to Aerial Chat
      </Text>

      <Divider label="Continue with username" labelPosition="center" my="lg" />

      <form
        onSubmit={form.onSubmit((values) => {
          handleSubmit(values);
        })}
      >
        <Stack>
          {type === 'register' && (
            <TextInput
              required
              label="Name"
              placeholder="Your name"
              value={form.values.name}
              onChange={(event) =>
                form.setFieldValue('name', event.currentTarget.value)
              }
            />
          )}
          <TextInput
            required
            label="Username"
            placeholder="Your username"
            value={form.values.username}
            onChange={(event) =>
              form.setFieldValue('username', event.currentTarget.value)
            }
            error={form.errors.username ? form.errors.username : usernameError}
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue('password', event.currentTarget.value)
            }
            error={form.errors.password}
          />
        </Stack>

        <Group position="apart" mt="xl">
          <Anchor
            component="button"
            type="button"
            color="dimmed"
            onClick={() => toggle()}
            size="xs"
          >
            {type === 'register'
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </Anchor>
          <Button type="submit">{upperFirst(type)}</Button>
        </Group>
      </form>
    </Paper>
  );
}
