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
  Checkbox,
  Anchor,
  Stack,
} from '@mantine/core';
import { trpc } from '~/utils/trpc';
import { SetStateAction } from 'react';
import { setCookie } from 'nookies';

interface LoginProps {
  setFunction: React.Dispatch<SetStateAction<string>>;
}

export function AuthenticationForm(
  { setFunction }: LoginProps,
  props: PaperProps,
) {
  const registerUser = trpc.user.register.useMutation();
  const utils = trpc.useContext();

  const [type, toggle] = useToggle(['login', 'register']);
  const form = useForm({
    initialValues: {
      username: '',
      name: '',
      password: '',
      terms: true,
    },
    // Fix the terms validation
    validate: {
      password: (val) =>
        val.length <= 6
          ? 'Password should include at least 6 characters'
          : null,
      terms: (val) => (val ? null : 'You must agree to the terms of service'),
    },
  });

  interface Values {
    username: string;
    name: string;
    password: string;
    terms?: boolean;
  }

  const handleSubmit = async (values: Values) => {
    let id;
    if (type !== 'login') {
      try {
        await registerUser.mutateAsync({
          name: values.name,
          username: values.username,
          password: values.password,
        });
        const user = await utils.user.login.fetch({
          username: values.username,
          password: values.password,
        });
        user.id ? (id = user.id) : (id = null);
      } catch {
        console.log('Could not register');
      }
    } else {
      const user = await utils.user.login.fetch({
        username: values.username,
        password: values.password,
      });
      user.id ? (id = user.id) : (id = null);
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
            error={form.errors.username && 'Invalid username'}
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue('password', event.currentTarget.value)
            }
            error={
              form.errors.password &&
              'Password should include at least 6 characters'
            }
          />

          {type === 'register' && (
            <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) =>
                form.setFieldValue('terms', event.currentTarget.checked)
              }
            />
          )}
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
