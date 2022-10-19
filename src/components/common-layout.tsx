import { useModel, useObservable } from 'kyoka';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Outlet, useLocation, useOutlet } from 'react-router';
import { Model } from '../model.js';
import Icon from './icon.js';
import Link from './link.js';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

interface MenuProps {
  href: string;
  children: string;
}

function Menu(props: MenuProps) {
  const path = useLocation().pathname;

  return (<Link href={props.href} className={path.startsWith(props.href) ? 'active' : ''}><Icon name="asterisk" /><div>{props.children}</div></Link>);
}

export default function CommonLayout() {
  const [menuVisible, setMenuVisible] = React.useState<boolean>(false);
  const outlet = useOutlet();
  const model = useModel<Model>();
  const location = useLocation();
  const elementMap = React.useRef<Record<string, React.Ref<any>>>({});
  elementMap.current[location.pathname] = elementMap.current[location.pathname] ?? React.createRef<any>();

  React.useEffect(() => {
    model.fetchAssets();
  }, []);

  return (
    <>
      <Helmet>
        <body className="common-layout" />
      </Helmet>
      <div id="bar"></div>
      <div id="wrapper">
        <nav id="nav">
          <div id="top-container">
            <div id="logo-container">
              <div id="logo-block">
                <Link aria-label="喫茶曆路" href="/">
                  <Icon name="logoFull" />
                </Link>
              </div>
            </div>
            <div id="menu-button-container"><div id="menu-button" onClick={e => {
              setMenuVisible(!menuVisible)
            }}><Icon name="menu2" /></div></div>
          </div>
          <div id="menu-container" className={menuVisible ? 'visible' : ''}>
            <ul id="menu">
              <li><Menu href="/about">About</Menu></li>
              <li><Menu href="/project">Projects</Menu></li>
              <li><Menu href="/log">Logs</Menu></li>
              <li><Menu href="/knowledge">Knowledge</Menu></li>
              <li><Menu href="/dictionary">Dictionary</Menu></li>
              <li><Menu href="/novel">Novels</Menu></li>
              <li><Menu href="/artwork">Artworks</Menu></li>
            </ul>
            <ul id="icons">
              <li><Link aria-label="RSS" href="https://koyomiji.com/feed.xml"><Icon name="rss" /></Link></li>
              <li><Link aria-label="Mail" href="mailto:k0michi@koyomi.co"><Icon name="mailIcon" /></Link></li>
              <li><Link aria-label="GitHub" href="https://github.com/k0michi"><Icon name="githubIcon" /></Link></li>
              <li><Link aria-label="YouTube" href="https://www.youtube.com/channel/UC_Kxh6WYU9-xQWYrNbT4mfw"><Icon name="youtubeIcon" /></Link></li>
              <li><Link aria-label="Twitch" href="https://www.twitch.tv/k0michi"><Icon name="twitchIcon" /></Link></li>
            </ul>
          </div>
        </nav>
        <main id="main">
          <SwitchTransition>
            <CSSTransition
              key={location.pathname}
              nodeRef={elementMap.current[location.pathname]}
              timeout={300}
              classNames="page"
              unmountOnExit>
              <div ref={elementMap.current[location.pathname]} className="page">
                {outlet}
              </div>
              </CSSTransition>
          </SwitchTransition>
        </main>
      </div>
    </>
  );
}