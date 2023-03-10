import { Paper, createStyles } from '@mantine/core';
import { AuthenticationForm } from './Authentication';
import React, { SetStateAction } from 'react';

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: 900,
    height: '100%',
    backgroundSize: 'cover',
    backgroundImage:
      'url(https://images.unsplash.com/27/flock.jpg?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80)',
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: 900,
    maxWidth: 450,
    paddingTop: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: '100%',
    },
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    width: 120,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

interface LoginProps {
  setFunction: React.Dispatch<SetStateAction<string>>;
}

export default function LoginPage({ setFunction }: LoginProps) {
  const { classes } = useStyles();
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <AuthenticationForm setFunction={setFunction} />
      </Paper>
    </div>
  );
}
