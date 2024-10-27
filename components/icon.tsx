import * as React from 'react';
import SVG from './svg.js';

export function LogoFull() {
  return <SVG loader={async () => (await import('../assets/kissa_koyomiji.svg?raw')).default} className="icon"></SVG>;
}

export function Asterisk() {
  return <SVG loader={async () => (await import('../assets/asterisk.svg?raw')).default} className="icon"></SVG>;
}

export function MailIcon() {
  return <SVG loader={async () => (await import('@tabler/icons/mail.svg?raw')).default} className="icon"></SVG>;
}

export function GithubIcon() {
  return <SVG loader={async () => (await import('@tabler/icons/brand-github.svg?raw')).default} className="icon"></SVG>;
}

export function YoutubeIcon() {
  return <SVG loader={async () => (await import('@tabler/icons/brand-youtube.svg?raw')).default} className="icon"></SVG>;
}

export function TwitchIcon() {
  return <SVG loader={async () => (await import('@tabler/icons/brand-twitch.svg?raw')).default} className="icon"></SVG>;
}

export function CalenderIcon() {
  return <SVG loader={async () => (await import('@tabler/icons/calendar-time.svg?raw')).default} className="icon"></SVG>;
}

export function TagsIcon() {
  return <SVG loader={async () => (await import('@tabler/icons/tags.svg?raw')).default} className="icon"></SVG>;
}

export function XIcon() {
  return <SVG loader={async () => (await import('feather-icons/dist/icons/x.svg?raw')).default} className="icon"></SVG>;
}

export function Menu2() {
  return <SVG loader={async () => (await import('@tabler/icons/menu-2.svg?raw')).default} className="icon"></SVG>;
}

export function RSS() {
  return <SVG loader={async () => (await import('@tabler/icons/rss.svg?raw')).default} className="icon"></SVG>;
}

export function Mastodon() {
  return <SVG loader={async () => (await import('@tabler/icons/brand-mastodon.svg?raw')).default} className="icon"></SVG>;
}