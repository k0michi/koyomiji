import * as Nano from "nano-jsx";

interface Props {
  top?: boolean;
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
          <li class="menu-item"><a href="/about">About</a></li>
          <li class="menu-item"><a href="/knowledge">Knowledge</a></li>
          <li class="menu-item"><a href="/log">Logs</a></li>
        </ul>
      </nav>
      <main id="main">
        {props.children}
      </main>
    </>
  );
}