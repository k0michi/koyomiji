import * as Nano from "nano-jsx";

export default function Frame(props: any) {
  return (
    <>
      <nav id="nav">
        <h1 id="site-logo"><a href="/"><img alt="曆路" id="logo-hr" /><img alt="曆路" id="logo-vt" /></a></h1>
        <h2><a href="/knowledge/">備忘録</a></h2>
        <h2><a href="/log/">雑記帳</a></h2>
      </nav>
      <div id="main-container">
        <main id="main">
          {props.children}
        </main>
      </div>
    </>
  );
}