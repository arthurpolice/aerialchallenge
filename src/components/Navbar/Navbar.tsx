import { useState } from 'react';
import { Navbar, UnstyledButton, createStyles, Stack } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition, library } from '@fortawesome/fontawesome-svg-core';
import {
  faGithub,
  faDiscord,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons';
import {
  faEnvelope,
  faBars,
  faPersonDigging,
  faRightFromBracket,
  faRightToBracket,
} from '@fortawesome/free-solid-svg-icons';
import styles from './Navbar.module.css';
import Link from 'next/link';
import { destroyCookie, parseCookies } from 'nookies';

const useStyles = createStyles((theme) => ({
  link: {
    width: 50,
    height: 50,
    borderRadius: theme.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[5]
          : theme.colors.gray[0],
    },
  },

  active: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({
        variant: 'light',
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
        .color,
    },
  },
}));

interface NavbarLinkProps {
  icon: IconDefinition;
  label: string;
  active?: boolean;
  open: boolean;
  onClick?(): void;
}

function NavbarLink({ icon, active, open, onClick }: NavbarLinkProps) {
  const { classes, cx } = useStyles();
  return (
    <span className={open ? styles.navbarButtonShow : styles.navbarButton}>
      <UnstyledButton
        onClick={onClick}
        className={cx(classes.link, { [classes.active]: active })}
      >
        <FontAwesomeIcon className={styles.navbarIcon} icon={icon} />
      </UnstyledButton>
    </span>
  );
}
library.add(
  faGithub,
  faDiscord,
  faLinkedin,
  faEnvelope,
  faPersonDigging,
  faRightFromBracket,
  faRightToBracket,
  faBars,
);

const mockdata = [
  {
    icon: faGithub,
    url: 'https://github.com/arthurpolice',
    label: 'Github',
  },
  {
    icon: faPersonDigging,
    url: 'https://arthurpoliceportfolio.netlify.app/',
    label: 'Portfolio',
  },
  {
    icon: faLinkedin,
    url: 'https://www.linkedin.com/in/arthur-police-87645525b/',
    label: 'LinkedIn',
  },
  {
    icon: faEnvelope,
    url: 'mailto:arthurpolice1@gmail.com',
    label: 'email',
  },
  {
    icon: faDiscord,
    url: 'https://discord.gg/K6jhwU8tgE',
    label: 'discord',
  },
];

export default function NavbarMinimal({
  setFunction,
}: {
  setFunction: (mode: string) => void;
}) {
  const cookies = parseCookies();
  const [userId, setUserId] = useState<string | undefined>(cookies.user_id);
  const [active, setActive] = useState<number | undefined>();
  const [open, setOpen] = useState<boolean>(false);

  const logout = () => {
    destroyCookie(null, 'user_id');
    setUserId(undefined);
    setFunction('login');
  };

  const links = mockdata.map((link, index) => (
    <Link
      className={open ? styles.navbarButtonShow : styles.navbarButton}
      key={link.label}
      href={link.url}
    >
      <NavbarLink
        {...link}
        open={open}
        active={index === active}
        onClick={() => setActive(index)}
      />
    </Link>
  ));
  return (
    <Navbar
      width={{ base: 80 }}
      p="md"
      className={open ? styles.navbarShow : styles.navbar}
      onMouseLeave={() => setOpen(false)}
    >
      <span className={styles.collapseButton}>
        <NavbarLink
          open={true}
          label={'Collapse'}
          onClick={() => setOpen(!open)}
          icon={faBars}
        />
      </span>
      <Navbar.Section grow mt={50}>
        <Stack justify="center" spacing={50}>
          {links}
        </Stack>
      </Navbar.Section>
      <Navbar.Section>
        <Stack justify="center" spacing={0}>
          {!userId && (
            <NavbarLink
              open={open}
              icon={faRightToBracket}
              label="Login"
              onClick={() => setFunction('login')}
            />
          )}
          {userId && (
            <NavbarLink
              open={open}
              icon={faRightFromBracket}
              label="Logout"
              onClick={logout}
            />
          )}
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
}
