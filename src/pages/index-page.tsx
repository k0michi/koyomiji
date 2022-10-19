import * as React from 'react';
import { useLocation } from 'react-router';
import CalenderGraph from '../components/calender-graph.js';
import Head from '../components/head.js';
import Link from '../components/link.js';
import { subDays } from 'date-fns';
import { useModel, useObservable } from 'kyoka';
import { Model } from '../model.js';
import { mapEntries } from '../entry.js';

export default function IndexPage() {
  const location = useLocation();
  const url = `https://koyomiji.com${location.pathname}`;
  const model = useModel<Model>();
  const entries = Object.values(useObservable(model.entries));

  const now = new Date();
  const begin = subDays(now, 364);

  return (
    <>
      <Head url={url} description="ようこそ。" />
      <header>
        <h1>Home</h1>
        <div className="meta">ようこそ。</div>
      </header>
      <div id="body">
        <CalenderGraph begin={begin} end={now} data={entries.map(e => new Date(e.created))} />
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