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
          <li><a href="/about">About</a></li>
          <li><a href="/knowledge">Knowledge</a></li>
          <li><a href="/log">Logs</a></li>
          <li><ul id="icons">
            <li><a href="mailto:k0michi@koyomi.co"><span class="mail-icon"></span></a></li>
            <li><a href="https://twitter.com/k0michi"><span class="twitter-icon"></span></a></li>
            <li><a href="https://github.com/k0michi"><span class="github-icon"></span></a></li>
            <li><a href="https://www.youtube.com/channel/UC_Kxh6WYU9-xQWYrNbT4mfw"><span class="youtube-icon"></span></a></li>
            <li><a href="https://www.twitch.tv/k0michi"><span class="twitch-icon"></span></a></li>
          </ul></li>
        </ul>
      </nav>
      <main id="main">
        {props.children}
      </main>
    </>
  );
}