import { useModel, useObservable } from 'kyoka';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Outlet, useLocation, useOutlet } from 'react-router';
import { Model } from '../model.js';
import { Asterisk, GithubIcon, LogoFull, MailIcon, RSS, TwitchIcon, YoutubeIcon } from './icon.js';
import Link from './link.js';

interface MenuProps {
  href: string;
  children: string;
}

function Menu(props: MenuProps) {
  const path = useLocation().pathname;

  return (<Link href={props.href} className={path.startsWith(props.href) ? 'active' : ''}><Asterisk /><div>{props.children}</div></Link>);
}

export default function CommonLayout() {
  const [menuVisible, setMenuVisible] = React.useState<boolean>(false);
  const outlet = useOutlet();
  const model = useModel<Model>();
  const location = useLocation();
  const elementMap = React.useRef<Record<string, React.Ref<any>>>({});
  elementMap.current[location.pathname] = elementMap.current[location.pathname] ?? React.createRef<any>();

  return (
    <>
      <Helmet>
        <body className="common-layout" />
      </Helmet>
      <div id="bar"></div>
      <div id="wrapper">
        <nav id="nav">
          <div id="logo-block">
            <Link aria-label="喫茶曆路" href="/">
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
            <li><Menu href="/about">About</Menu></li>
            <li><Menu href="/project">Projects</Menu></li>
            <li><Menu href="/log">Logs</Menu></li>
            <li><Menu href="/reference">Reference</Menu></li>
            <li><Menu href="/dictionary">Dictionary</Menu></li>
            <li><Menu href="/novel">Novels</Menu></li>
            <li><Menu href="/artwork">Artworks</Menu></li>
          </ul>
          <ul id="icons">
            <li><Link aria-label="RSS" href="https://koyomiji.com/feed.xml"><RSS /></Link></li>
            <li><Link aria-label="Mail" href="mailto:k0michi@koyomi.co"><MailIcon /></Link></li>
            <li><Link aria-label="GitHub" href="https://github.com/k0michi"><GithubIcon /></Link></li>
            <li><Link aria-label="YouTube" href="https://www.youtube.com/channel/UC_Kxh6WYU9-xQWYrNbT4mfw"><YoutubeIcon /></Link></li>
            <li><Link aria-label="Twitch" href="https://www.twitch.tv/k0michi"><TwitchIcon /></Link></li>
          </ul>
        </nav>
        <main id="main">
          {outlet}
        </main>
        <div id="footer">
          <div id="copyright">
            © 2022-2023 Kissa-Koyomiji<br />
            Except where otherwise noted, content on this site is licensed under <Link href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</Link>.
          </div>
        </div>
      </div>
    </>
  );
}