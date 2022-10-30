import * as React from 'react';
import { useLocation } from 'react-router';
import Link from '../components/link.js';
import Head from '../components/head.js';

export default function AboutPage() {
  return (
    <>
      <Head title="About" description="このサイトについて。" />
      <header>
        <h1>About</h1>
        <div className="meta">このサイトについて。</div>
      </header>
      <div id="body">
        <h2>サイトについて</h2>
        <p>当サイト、喫茶<ruby>曆路<rp></rp><rt>こよみじ</rt><rp></rp></ruby> を運営している、<ruby>曆月<rp></rp><rt>れきづき</rt><rp></rp></ruby>こみち と申します。このサイトは、私が気まぐれに勉強したことを書いたり、日記を書いたり、創作したりするための場所です。プログラミングや英語、数学に関する内容が多いですが、これらに限らず私の興味のあることを取り扱っていきます。</p>
        <p>特段の明記がない限り、サイト上のコンテンツは<Link href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</Link>に準拠することとします。</p>
        <h2>ページについて</h2>
        <ul>
          <li><Link href="/project">Projects</Link>には、私が開発している(していた)いくつかのソフトウェアの紹介があります。</li>
          <li><Link href="/log">Logs</Link>は、私のブログです。日記やエッセイなどを、形式に囚われず自由に書いています。</li>
          <li><Link href="/reference">Reference</Link>は、私が学んだことの備忘録です。</li>
          <li><Link href="/dictionary">Dictionary</Link>は、私が出逢った英単語をまとめた辞書です。</li>
        </ul>
        <h2>フィードについて</h2>
        <p>サイトのAtomフィードは<Link href="https://koyomiji.com/feed.xml">https://koyomiji.com/feed.xml</Link>にあります。このサイトの更新情報を、お好みのRSSリーダーで取得することが可能です。</p>
        <h2>お問い合せ</h2>
        <p><Link href="mailto:k0michi@koyomi.co">k0michi@koyomi.co</Link>まで。何でも大歓迎です。</p>
        <h2>技術構成について</h2>
        <p>当サイトの全てのページは、TypeScriptで書かれた自作の静的サイトジェネレータを使用して生成されています。フロントエンドフレームワークにはReactを採用し、モジュールバンドラにはViteを使用しています。サイトはVercel上でビルド、ホストされています。</p>
        <p>サイト上のテキストは、XMLベースのフォーマットで記述されています。</p>
        <h2>運営方針について</h2>
        <p>レトロモダンなWebサイト作りを目標としています。</p>
      </div>
    </>
  );
}