import * as Nano from "nano-jsx";
import Frame from "./frame.js";

export default function IndexPage() {
  const url = `https://koyomiji.com/`;

  return (
    <>
      <Nano.Helmet>
        <title>曆路喫茶館</title>
        <meta name="description" content="" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content="曆路喫茶館" />
        <meta property="og:description" content="" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@k0michi" />
      </Nano.Helmet>
      <Frame>
        <h2><a href="/about">プロフィール</a></h2>
        <p>私は一体誰か。</p>
        <h2><a href="/knowledge">備忘録</a></h2>
        <p>覚書。</p>
        <h2><a href="/blog">雑記帳</a></h2>
        <p>たわいもない話を書いています。</p>
        <h2><a href="https://twitter.com/k0michi">Twitter</a></h2>
        <p>フォローされると喜びます。</p>
        <h2><a href="https://github.com/k0michi">GitHub</a></h2>
        <p>開発したものとか。</p>
        <h2><a href="https://www.twitch.tv/k0michi">Twitch</a></h2>
        <p>超不定期配信。</p>
        <h2><a href="https://www.youtube.com/channel/UC_Kxh6WYU9-xQWYrNbT4mfw">YouTube</a></h2>
        <p>とりあえず作ったチャンネル。</p>
      </Frame>
    </>
  );
}