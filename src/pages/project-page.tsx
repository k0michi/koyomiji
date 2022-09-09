import * as React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router';
import Link from '../components/link.js';

export default function ProjectPage() {
  const location = useLocation();
  const url = `https://koyomiji.com${location.pathname}`;

  return (
    <>
      <Helmet>
        <title>Projects | 曆路喫茶館</title>
        <meta name="description" content="" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content="About" />
        <meta property="og:description" content="" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@k0michi" />
      </Helmet>
      <header>
        <h1>Projects</h1>
        <div className="meta">開発したもの。</div>
      </header>
      <div id="body">
        <h2><Link href="https://github.com/k0michi/isomorphic-dom">@k0michi/isomorphic-dom</Link></h2>
        <p>jsdomとネイティブのDOM APIへのプロキシライブラリ。</p>
        <h2><Link href="https://k0michi.github.io/chronograph/">Chronograph</Link></h2>
        <p>時間を記録、可視化するためのツール。ボタンをクリックして現在時刻を記録し、時刻を一覧表示することができます。各時刻にはメモを残すことも可能です。</p>
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