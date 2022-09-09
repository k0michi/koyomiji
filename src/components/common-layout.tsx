import { useModel, useObservable } from 'kyoka';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Outlet, useLocation, useOutlet } from 'react-router';
import { Model } from '../model.js';
import Icon from './icon.js';
import Link from './link.js';

interface MenuProps {
  href: string;
  children: string;
}

function Menu(props: MenuProps) {
  const path = useLocation().pathname;

  return (<Link href={props.href} className={path.startsWith(props.href) ? 'active' : ''}><Icon name="asterisk" /><div>{props.children}</div></Link>);
}

export default function MainLayout() {
  const [visible, setVisible] = React.useState<boolean>(true);
  const [showing, setShowing] = React.useState<React.ReactElement | null>();
  const [menuVisible, setMenuVisible] = React.useState<boolean>(false);
  const outlet = useOutlet();
  const model = useModel<Model>();

  React.useEffect(() => {
    model.fetchAssets();
  }, []);

  /*
  React.useEffect(() => {
    if (showing != null) {
      setVisible(false);

      setTimeout(() => {
        setVisible(true);
        setShowing(outlet);
      }, 250);
    } else {
      setShowing(outlet);
    }
  }, [location.pathname]);
  */

  return (
    <>
      <Helmet>
        <body className="common-layout" />
      </Helmet>
      <div id="bar"></div>
      <nav id="nav">
        <div id="top-container">
          <div id="logo-container">
            <div id="logo-block">
              <Link href="/">
                <Icon name="logoFull" />
              </Link>
            </div>
          </div>
          <div id="menu-button-container"><div id="menu-button" onClick={e=>{
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
            <li><Link href="mailto:k0michi@koyomi.co"><Icon name="mailIcon" /></Link></li>
            <li><Link href="https://github.com/k0michi"><Icon name="githubIcon" /></Link></li>
            <li><Link href="https://www.youtube.com/channel/UC_Kxh6WYU9-xQWYrNbT4mfw"><Icon name="youtubeIcon" /></Link></li>
            <li><Link href="https://www.twitch.tv/k0michi"><Icon name="twitchIcon" /></Link></li>
          </ul>
        </div>
      </nav>
      <main id="main" className={visible ? '' : 'invisible'}>
        <React.Suspense fallback={<p>Loading</p>}>
          {showing == null ? outlet : showing}
        </React.Suspense>
      </main>
    </>
  );
}