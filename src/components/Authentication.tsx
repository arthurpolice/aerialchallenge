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
import { useState } from 'react';

export function AuthenticationForm(props: PaperProps) {
  const mutation = trpc.user.register.useMutation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  let user = trpc.user.login.useQuery({username: username, password: password})
  const [type, toggle] = useToggle(['login', 'register']);
  const form = useForm({
    initialValues: {
      username: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      password: (val) =>
        val.length <= 6
          ? 'Password should include at least 6 characters'
          : null,
      terms: (val) =>
        val?null:'You must agree to the terms of service',
    },
  });

  interface Values {
    username: string,
    name: string,
    password: string,
    terms?: boolean
  }

  const handleSubmit = (values: Values) => {
    if (type !== 'login') {
      const submit = mutation.mutate({
        name: values.name,
        username: values.username,
        password: values.password,
      })
      console.log(submit)
    }
    else {
      setUsername(values.username)
      setPassword(values.password)
      user.refetch()
      console.log(user)
    }
  }
  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <Text size="lg" weight={500}>
        Welcome to Aerial Chat
      </Text>

      <Divider label="Continue with username" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit((values) => {handleSubmit(values)})}>
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
