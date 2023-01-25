import { useEffect, useState } from 'react';
import LoginPage from '~/components/LoginPage';
import { parseCookies } from 'nookies';
import ChatPage from '~/components/Chat';

const IndexPage = () => {
  const cookies = parseCookies();
  const [mode, setMode] = useState('chat');
  if (mode === 'login') {
    return <LoginPage setFunction={setMode} />;
  } else {
    return <ChatPage setFunction={setMode} />;
  }
};

export default IndexPage;
