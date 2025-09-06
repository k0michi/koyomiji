import * as React from 'react';
import { Link, Outlet, useLoaderData, useLocation } from 'react-router';
import { Asterisk, GithubIcon, LogoFull, MailIcon, Mastodon, RSS, TwitchIcon, YoutubeIcon } from '../../components/icon';
import { Handle } from '~/Handle';
import { Route } from './+types/_common';
import { useDevReload } from '~/Hook.index';

interface MenuProps {
  to: string;
  children: string;
}

function Menu(props: MenuProps) {
  const path = useLocation().pathname;

  return (<Link to={props.to} className={path.startsWith(props.to) ? 'active' : ''}><Asterisk /><div>{props.children}</div></Link>);
}

export const handle: Handle = () => {
  return {
    body: {
      className: 'common-layout'
    }
  };
}

export const loader = ({ }: Route.LoaderArgs) => {
  return { year: (new Date).getFullYear() };
};

export default function CommonLayout() {
  const [menuVisible, setMenuVisible] = React.useState<boolean>(false);
  const location = useLocation();
  const elementMap = React.useRef<Record<string, React.Ref<any>>>({});
  elementMap.current[location.pathname] = elementMap.current[location.pathname] ?? React.createRef<any>();
  const data = useLoaderData<typeof loader>();
  useDevReload();

  return (
    <>
      <div id="bar"></div>
      <div id="wrapper">
        <nav id="nav">
          <div id="logo-block">
            <Link aria-label="喫茶曆路" to="/">
              <LogoFull />
            </Link>
          </div>
          {/*<div id="menu-button-container">
            <div id="menu-button" onClick={e => {
              setMenuVisible(!menuVisible)
            }}><Icon name="menu2" />
            </div>
          </div>*/}
          <ul id="menu">
            <li><Menu to="/about">About</Menu></li>
            <li><Menu to="/project">Projects</Menu></li>
            <li><Menu to="/log">Logs</Menu></li>
            {/* <li><Menu to="/reference">Reference</Menu></li>
            <li><Menu to="/dictionary">Dictionary</Menu></li> */}
            <li><Menu to="/novel">Novels</Menu></li>
            <li><Menu to="/artwork">Artworks</Menu></li>
            <li><Menu to="/photograph">Photographs</Menu></li>
          </ul>
          <ul id="icons">
            <li><Link aria-label="RSS" to="https://koyomiji.com/feed.xml"><RSS /></Link></li>
            <li><Link aria-label="Mail" to="mailto:k0michi@koyomi.co"><MailIcon /></Link></li>
            {/* <li><Link aria-label="Mastodon" rel="me" to="https://koyomi.co/@k0michi"><Mastodon /></Link></li> */}
            <li><Link aria-label="GitHub" rel="me" to="https://github.com/k0michi"><GithubIcon /></Link></li>
            {/* <li><Link aria-label="YouTube" rel="me" to="https://www.youtube.com/channel/UC_Kxh6WYU9-xQWYrNbT4mfw"><YoutubeIcon /></Link></li> */}
            {/* <li><Link aria-label="Twitch" rel="me" to="https://www.twitch.tv/k0michi"><TwitchIcon /></Link></li> */}
          </ul>
        </nav>
        <main id="main">
          <Outlet />
        </main>
        <div id="footer">
          <div id="copyright">
            © 2022-{data.year} Kissa-Koyomiji<br />
            Except where otherwise noted, content on this site is licensed under <Link to="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</Link>.
          </div>
        </div>
      </div>
    </>
  );
}