import * as React from 'react';

interface IconProps {
  name: string;
}

export default function Icon(props: IconProps) {
  const [imported, setImported] = React.useState<string>();

  React.useEffect(() => {
    (async () => {
      if (props.name == 'logoFull') {
        setImported((await import('../assets/kissa_koyomiji.svg?raw')).default);
      } else if (props.name == 'asterisk') {
        setImported((await import('../assets/asterisk.svg?raw')).default);
      } else if (props.name == 'mailIcon') {
        setImported((await import('@tabler/icons/mail.svg?raw')).default);
      } else if (props.name == 'githubIcon') {
        setImported((await import('@tabler/icons/brand-github.svg?raw')).default);
      } else if (props.name == 'youtubeIcon') {
        setImported((await import('@tabler/icons/brand-youtube.svg?raw')).default);
      } else if (props.name == 'twitchIcon') {
        setImported((await import('@tabler/icons/brand-twitch.svg?raw')).default);
      } else if (props.name == 'calenderIcon') {
        setImported((await import('@tabler/icons/calendar-time.svg?raw')).default);
      } else if (props.name == 'tagsIcon') {
        setImported((await import('@tabler/icons/tags.svg?raw')).default);
      } else if (props.name == 'xIcon') {
        setImported((await import('feather-icons/dist/icons/x.svg?raw')).default);
      } else if (props.name == 'menu2') {
        setImported((await import('@tabler/icons/menu-2.svg?raw')).default);
      } else if (props.name == 'rss') {
        setImported((await import('@tabler/icons/rss.svg?raw')).default);
      } else {
        throw new Error('Unknown icon');
      }
    })();
  }, []);

  if (imported != null) {
    return <div className="icon" dangerouslySetInnerHTML={{ __html: imported }} />;
  } else {
    return <div className="icon" />;
  }
}