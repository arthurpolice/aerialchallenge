import { useState } from 'react';
import LoginPage from '~/components/LoginPage';
import ChatPage from '~/components/Chat';
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import '@fortawesome/fontawesome-svg-core/styles.css';
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from '@fortawesome/fontawesome-svg-core';
import NavbarMinimal from '~/components/Navbar/Navbar';
config.autoAddCss = false;

const IndexPage = () => {
  const [mode, setMode] = useState('chat');
  if (mode === 'login') {
    return <LoginPage setFunction={setMode} />;
  } else {
    return (
      <>
        <NavbarMinimal setFunction={setMode} />
        <ChatPage setFunction={setMode} />
      </>
    );
  }
};

export default IndexPage;
