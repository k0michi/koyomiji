import * as Nano from "nano-jsx";

interface Props {
  children: any;
}

export default function Frame(props: Props) {
  return (
    <>
      <nav id="nav">
        <div id="logo-container">
          <a href="/">
            <img alt="曆路喫茶館" id="logo" />
          </a>
        </div>
        <ul id="menu">
          <li class="asterisk"><a href="/about">About</a></li>
          <li class="asterisk"><a href="/knowledge">Knowledge</a></li>
          <li class="asterisk"><a href="/log">Logs</a></li>
          <li><ul id="icons">
            <li class="mail-icon"></li>
            <li class="twitter-icon"></li>
            <li class="github-icon"></li>
            <li class="youtube-icon"></li>
            <li class="twitch-icon"></li>
          </ul></li>
        </ul>
      </nav>
      <main id="main">
        {props.children}
      </main>
    </>
  );
}