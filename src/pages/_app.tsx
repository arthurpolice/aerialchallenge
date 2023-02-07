import type { AppProps } from 'next/app';
import { trpc } from '~/utils/trpc';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import '../styles/MessageBox.css';
import '../styles/PhotoMessage.css';
import '../styles/styles.css';

const MyApp = (props: AppProps) => {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>Aerial Chat</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: 'light',
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
