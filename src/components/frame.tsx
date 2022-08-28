import { useModel, useObservable } from 'kyoka';
import * as React from 'react';
import { Outlet, useLocation, useOutlet } from 'react-router';
import { Model } from '../model.js';
import Link from './link.js';

export default function Frame() {
  const path = useLocation().pathname;
  const [visible, setVisible] = React.useState<boolean>(true);
  const [showing, setShowing] = React.useState<React.ReactElement | null>();
  const outlet = useOutlet();
  const location = useLocation();
  const model = useModel<Model>();
  const assets = useObservable(model.assets);

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

  React.useEffect(() => {
    model.fetchAssets();
  }, []);

  return (
    <>
      <div id="bar"></div>
      <nav id="nav">
        <div id="logo-container">
          <Link href="/">
            <div dangerouslySetInnerHTML={{ __html: assets['logoFull'] }}></div>
          </Link>
        </div>
        <ul id="menu">
          <li><Link href="/about" className={path.startsWith('/about') ? 'active' : ''}><div dangerouslySetInnerHTML={{ __html: assets['asterisk'] }} /><div>About</div></Link></li>
          <li><Link href="/project" className={path.startsWith('/project') ? 'active' : ''}><div dangerouslySetInnerHTML={{ __html: assets['asterisk'] }} /><div>Projects</div></Link></li>
          <li><Link href="/knowledge" className={path.startsWith('/knowledge') ? 'active' : ''}><div dangerouslySetInnerHTML={{ __html: assets['asterisk'] }} /><div>Knowledge</div></Link></li>
          <li><Link href="/log" className={path.startsWith('/log') ? 'active' : ''}><div dangerouslySetInnerHTML={{ __html: assets['asterisk'] }} /><div>Logs</div></Link></li>
        </ul>
        <ul id="icons">
          <li><Link href="mailto:k0michi@koyomi.co"><span dangerouslySetInnerHTML={{ __html: assets['mailIcon'] }} /></Link></li>
          <li><Link href="https://github.com/k0michi"><span dangerouslySetInnerHTML={{ __html: assets['githubIcon'] }} /></Link></li>
          <li><Link href="https://www.youtube.com/channel/UC_Kxh6WYU9-xQWYrNbT4mfw"><span dangerouslySetInnerHTML={{ __html: assets['youtubeIcon'] }} /></Link></li>
          <li><Link href="https://www.twitch.tv/k0michi"><span dangerouslySetInnerHTML={{ __html: assets['twitchIcon'] }} /></Link></li>
        </ul>
      </nav>
      <main id="main" className={visible ? '' : 'invisible'}>
        <React.Suspense fallback={<p>Loading</p>}>
          {showing}
        </React.Suspense>
      </main>
    </>
  );
}