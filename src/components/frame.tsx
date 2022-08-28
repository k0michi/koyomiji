import * as React from 'react';
import { Outlet, useLocation } from 'react-router';

export default function Frame() {
  const path = useLocation().pathname;
  const [assets, setAssets] = React.useState<{ [key: string]: any }>({});

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
      <nav id="nav">
        <div id="logo-container">
          <a href="/">
            <div dangerouslySetInnerHTML={{ __html: assets['logoFull'] }}></div>
          </a>
        </div>
        <ul id="menu">
          <li><a href="/about" className={path.startsWith('/about') ? 'active' : ''}><div dangerouslySetInnerHTML={{ __html: assets['asterisk'] }} /><div>About</div></a></li>
          <li><a href="/project" className={path.startsWith('/project') ? 'active' : ''}><div dangerouslySetInnerHTML={{ __html: assets['asterisk'] }} /><div>Projects</div></a></li>
          <li><a href="/knowledge" className={path.startsWith('/knowledge') ? 'active' : ''}><div dangerouslySetInnerHTML={{ __html: assets['asterisk'] }} /><div>Knowledge</div></a></li>
          <li><a href="/log" className={path.startsWith('/log') ? 'active' : ''}><div dangerouslySetInnerHTML={{ __html: assets['asterisk'] }} /><div>Logs</div></a></li>
        </ul>
        <ul id="icons">
          <li><a href="mailto:k0michi@koyomi.co"><span dangerouslySetInnerHTML={{ __html: assets['mailIcon'] }} /></a></li>
          <li><a href="https://github.com/k0michi"><span dangerouslySetInnerHTML={{ __html: assets['githubIcon'] }} /></a></li>
          <li><a href="https://www.youtube.com/channel/UC_Kxh6WYU9-xQWYrNbT4mfw"><span dangerouslySetInnerHTML={{ __html: assets['youtubeIcon'] }} /></a></li>
          <li><a href="https://www.twitch.tv/k0michi"><span dangerouslySetInnerHTML={{ __html: assets['twitchIcon'] }} /></a></li>
        </ul>
      </nav>
      <main id="main">
        <Outlet />
      </main>
    </>
  );
}