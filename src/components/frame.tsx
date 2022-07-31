import * as React from 'react';
import { Outlet } from 'react-router';

export default function Frame() {
  return (
    <>
      <nav id="nav">
        <div id="logo-container">
          <a href="/">
            <img alt="曆路喫茶館" id="logo" />
          </a>
        </div>
        <ul id="menu">
          <li><a href="/about"><div className="asterisk" /><div>About</div></a></li>
          <li><a href="/knowledge"><div className="asterisk" /><div>Knowledge</div></a></li>
          <li><a href="/log"><div className="asterisk" /><div>Logs</div></a></li>
        </ul>
        <ul id="icons">
          <li><a href="mailto:k0michi@koyomi.co"><span className="mail-icon"></span></a></li>
          <li><a href="https://twitter.com/k0michi"><span className="twitter-icon"></span></a></li>
          <li><a href="https://github.com/k0michi"><span className="github-icon"></span></a></li>
          <li><a href="https://www.youtube.com/channel/UC_Kxh6WYU9-xQWYrNbT4mfw"><span className="youtube-icon"></span></a></li>
          <li><a href="https://www.twitch.tv/k0michi"><span className="twitch-icon"></span></a></li>
        </ul>
      </nav>
      <main id="main">
        <Outlet />
      </main>
    </>
  );
}