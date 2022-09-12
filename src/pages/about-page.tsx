import * as React from 'react';
import { useLocation } from 'react-router';
import Link from '../components/link.js';
import Head from '../components/head.js';

export default function AboutPage() {
  const location = useLocation();
  const url = `https://koyomiji.com${location.pathname}`;

  return (
    <>
      <Head url={url} title="About" description="私は一体誰か。" />
      <header>
        <h1>About</h1>
        <div className="meta">私は一体誰か。</div>
      </header>
      <div id="body">
        <h2>サイトについて</h2>
        <p>初めまして。このサイト <ruby>曆路<rp></rp><rt>こよみじ</rt><rp></rp></ruby>喫茶館 を運営している Komichi と申します。このサイトは、私が気まぐれに勉強したことを書いたり、日記を書いたり、創作したりするための場所です。プログラミングや英語、数学に関する内容が多いですが、これらに限らず私の興味のあることを取り扱っていきます。</p>
        <p>特段の明記がない限り、サイト上のコンテンツは<Link href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</Link>に準拠します。</p>
        <h2>サイト内のページについて</h2>
        <ul>
          <li><Link href="/project">Projects</Link>には、私が開発している(していた)いくつかのソフトウェアの紹介があります。</li>
          <li><Link href="/log">Logs</Link>は、私のブログです。日記やエッセイなどを、形式に囚われず自由に書いています。</li>
          <li><Link href="/knowledge">Knowledge</Link>は、私が学んだことの備忘録です。</li>
          <li><Link href="/dictionary">Dictionary</Link>は、私が出逢った英単語をまとめた辞書です。</li>
        </ul>
        <h2>サイトの技術構成について</h2>
        <p>このサイトは、既存の技術スタックに極力依存しないことを目標として作成されています。</p>
        <p>全てのページは、Node.js上で動く自作の静的サイトジェネレータを使用して生成されています。フロントエンドフレームワークにはReactを採用し、モジュールバンドラにはViteを使用しています。サイトはVercel上でビルドされ、ホストされています。</p>
        <p>サイト上のテキストは、XMLベースの独自フォーマットで記述されています。</p>
      </div>
    </>
  );
}