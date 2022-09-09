import * as React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router';
import Link from '../components/link.js';

export default function IndexPage() {
  const location = useLocation();
  const url = `https://koyomiji.com${location.pathname}`;

  return (
    <>
      <Helmet>
        <title>曆路喫茶館</title>
        <meta name="description" content="" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content="曆路喫茶館" />
        <meta property="og:description" content="" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@k0michi" />
      </Helmet>
      <header>
        <h1>Home</h1>
        <div className="meta">ようこそ。</div>
      </header>
      <div id="body">
        <h2><Link href="/about">プロフィール</Link></h2>
        <p>私は一体誰か。</p>
        <h2><Link href="/knowledge">備忘録</Link></h2>
        <p>覚書。</p>
        <h2><Link href="/log">雑記帳</Link></h2>
        <p>たわいもない話を書いています。</p>
        <h2><Link href="https://github.com/k0michi">GitHub</Link></h2>
        <p>開発したものとか。</p>
        <h2><Link href="https://www.twitch.tv/k0michi">Twitch</Link></h2>
        <p>超不定期配信。</p>
        <h2><Link href="https://www.youtube.com/channel/UC_Kxh6WYU9-xQWYrNbT4mfw">YouTube</Link></h2>
        <p>とりあえず作ったチャンネル。</p>
      </div>
    </>
  );
}