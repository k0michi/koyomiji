import * as React from 'react';
import { useLocation } from 'react-router';
import Head from '../components/head.js';
import Link from '../components/link.js';

export default function ProjectPage() {
  const location = useLocation();
  const url = `https://koyomiji.com${location.pathname}`;

  return (
    <>
      <Head url={url} title="Projects" description="開発したもの。" />
      <header>
        <h1>Projects</h1>
        <div className="meta">開発したもの。</div>
      </header>
      <div id="body">
        <h2><Link href="https://github.com/k0michi/kotonoha">Kotonoha</Link></h2>
        <p>Ankiクローン。単語学習アプリ。</p>
        <h2><Link href="https://github.com/k0michi/isomorphic-dom">@k0michi/isomorphic-dom</Link></h2>
        <p>jsdomとネイティブのDOM APIへのプロキシライブラリ。</p>
        <h2><Link href="https://k0michi.github.io/chronograph/">Chronograph</Link></h2>
        <p>時間を記録、可視化するためのツール。ボタンをクリックして現在時刻を記録し、時刻を一覧表示することができる。各時刻にはメモを残すことが可能。</p>
        <h2><Link href="https://k0michi.github.io/toolbox/">Toolbox</Link></h2>
        <p>個人的に使うためのWebツール。</p>
        <h2><Link href="https://github.com/k0michi/kyoka">Kyōka</Link></h2>
        <p>React用のロジック、ステート管理ライブラリ。</p>
        <h2><Link href="https://github.com/k0michi/hipt">hipt (Hierarchically Indented Plain Text)</Link></h2>
        <p>インデントされたテキストをパースするライブラリ。</p>
      </div>
    </>
  );
}