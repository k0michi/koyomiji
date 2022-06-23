import * as Nano from "nano-jsx";
import Frame from "./frame.js";

export default function AboutPage() {
  const url = `https://koyomiji.com/about`;

  return (
    <>
      <Nano.Helmet>
        <title>プロフィール | 曆路喫茶館</title>
        <meta name="description" content="" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content="プロフィール" />
        <meta property="og:description" content="" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@k0michi" />
      </Nano.Helmet>
      <Frame>
        <p>管理人: 小路はじめ (<a href="https://twitter.com/k0michi">@k0michi</a>)</p>
        <p>情報技術や英語、数学を学んでいます。</p>
        <p>最近の趣味は読書です。シャーロックホームズなど、推理小説が好きです。</p>
        <p>主にWebサイト、デスクトップアプリ、ゲームを開発しています。</p>
        <p>お絵描き練習中です。</p>
        <p>Administrator: Hajime Komichi (<a href="https://twitter.com/k0michi">@k0michi</a>)</p>
        <p>I'm a Japanese student and learning information technology, English and mathematics.</p>
        <p>My hobby is reading mysteries. I'm fond of Sherlock Holmes series.</p>
        <p>I mainly develop websites, desktop apps and games.</p>
        <p>I'm currently practicing drawing pictures.</p>
      </Frame>
    </>
  );
}