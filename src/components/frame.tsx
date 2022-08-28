import * as React from 'react';
import { Outlet, useLocation, useOutlet } from 'react-router';
import Link from './link.js';

export default function Frame() {
  const path = useLocation().pathname;
  const [assets, setAssets] = React.useState<{ [key: string]: any }>({});
  const [visible, setVisible] = React.useState<boolean>(true);
  const [showing, setShowing] = React.useState<React.ReactElement | null>();
  const outlet = useOutlet();
  const location = useLocation();

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
    (async () => {
      const assets: { [key: string]: any } = {};
      assets['logoFull'] = (await import('../assets/koyomiji_full_hr.svg?raw')).default;
      assets['asterisk'] = (await import('../assets/asterisk.svg?raw')).default;
      assets['mailIcon'] = (await import('@tabler/icons/mail.svg?raw')).default;
      assets['githubIcon'] = (await import('@tabler/icons/brand-github.svg?raw')).default;
      assets['youtubeIcon'] = (await import('@tabler/icons/brand-youtube.svg?raw')).default;
      assets['twitchIcon'] = (await import('@tabler/icons/brand-twitch.svg?raw')).default;
      assets['calenderIcon'] = (await import('@tabler/icons/calendar-time.svg?raw')).default;
      assets['tagsIcon'] = (await import('@tabler/icons/tags.svg?raw')).default;
      setAssets(assets);
    })();
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