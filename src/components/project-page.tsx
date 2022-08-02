import * as React from 'react';
import { Helmet } from 'react-helmet';
import Frame from "./frame.js";

export default function ProjectPage() {
  const url = `https://koyomiji.com/project`;

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
      <h2><a href="https://k0michi.github.io/chronograph/">Chronograph</a></h2>
      <p>時間を記録、可視化するためのツール。ボタンをクリックして現在時刻を記録し、時刻を一覧表示することができます。各時刻にはメモを残すことも可能です。</p>
      <h2><a href="https://k0michi.github.io/toolbox/">Toolbox</a></h2>
      <p>個人的に使うためのWebツール。</p>
      <h2><a href="https://github.com/k0michi/kyoka">Kyōka</a></h2>
      <p>React用のロジック、ステート管理ライブラリ。</p>
      <h2><a href="https://github.com/k0michi/hipt">hipt (Hierarchically Indented Plain Text)</a></h2>
      <p>インデントされたテキストをパースするライブラリ。</p>
    </>
  );
}