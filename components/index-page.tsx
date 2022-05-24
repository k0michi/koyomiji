import * as Nano from "nano-jsx";
import Frame from "./frame.js";

export default function IndexPage(props: any) {
  return (
    <>
      <Nano.Helmet>
        <title>曆路堂</title>
      </Nano.Helmet>
      <Frame>
        曆路堂へようこそ。<br />
        <h2><a href="/knowledge/">備忘録</a></h2>
        <h2><a href="/blog/">雑記帳</a></h2>
        <h2><a href="https://twitter.com/k0michi">Twitter</a></h2>
        <h2><a href="https://github.com/k0michi">GitHub</a></h2>
        <h2><a href="https://www.twitch.tv/k0michi">Twitch</a></h2>
      </Frame>
    </>
  );
}