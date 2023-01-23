import { useEffect, useState } from 'react';
import LoginPage from '~/components/LoginPage';
import { parseCookies } from 'nookies';
import ChatPage from '~/components/Chat';

const IndexPage = () => {
  const cookies = parseCookies();
  const [mode, setMode] = useState('login');
  useEffect(() => {
    if (cookies.user_id) {
      setMode('chat');
    }
  }, [cookies.user_id]);
  if (mode === 'login') {
    return <LoginPage setFunction={setMode} />;
  } else {
    return <ChatPage />;
  }
};

export default IndexPage;
