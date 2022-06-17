import * as Nano from "nano-jsx";

export default function Frame(props: any) {
  return (
    <>
      <nav id="nav">
        <h1 id="site-title"><a href="/">曆路喫茶館</a></h1>
        <h2><a href="/knowledge/">備忘録</a></h2>
        <h2><a href="/blog/">雑記帳</a></h2>
      </nav>
      <div id="main-container">
        <main id="main">
          {props.children}
        </main>
      </div>
    </>
  );
}