import * as React from 'react';
import { Link, MetaFunction } from 'react-router';
import { getMeta } from 'lib/meta';
import { Route } from './+types/_common.project';

export const meta = ({ location }: Route.MetaArgs) => getMeta({
  title: "Projects",
  description: "開発したもの。",
  location
});

export default function ProjectPage() {
  return (
    <>
      <header>
        <h1>Projects</h1>
        <div className="meta">開発したもの。</div>
      </header>
      <div id="body">
        <h2><Link to="https://github.com/k0michi/kakisute">Kakisute</Link></h2>
        <div className='meta'>
          Built with TypeScript, React, Electron, Vite
        </div>
        <p>個人的に使うためのメモ帳。階層構造とタグによってメモを管理できる。</p>
        <h2><Link to="https://github.com/k0michi/kotonoha">Kotonoha</Link></h2>
        <div className='meta'>
          Built with TypeScript, React, Electron, Vite
        </div>
        <p>Ankiクローン。単語学習アプリ。</p>
        <h2><Link to="https://github.com/k0michi/isomorphic-dom">@k0michi/isomorphic-dom</Link></h2>
        <div className='meta'>
          Built with TypeScript
        </div>
        <p>jsdomとネイティブのDOM APIへのプロキシライブラリ。</p>
        <h2><Link to="https://k0michi.github.io/chronograph/">Chronograph</Link></h2>
        <div className='meta'>
          Built with TypeScript, React, Vite
        </div>
        <p>時間を記録、可視化するためのツール。ボタンをクリックして現在時刻を記録し、時刻を一覧表示することができる。各時刻にはメモを残すことが可能。</p>
        <h2><Link to="https://k0michi.github.io/toolbox/">Toolbox</Link></h2>
        <div className='meta'>
          Built with TypeScript, React, Vite
        </div>
        <p>個人的に使うためのWebツール。</p>
        <h2><Link to="https://github.com/k0michi/kyoka">Kyōka</Link></h2>
        <div className='meta'>
          Built with TypeScript
        </div>
        <p>React用のロジック、ステート管理ライブラリ。</p>
        <h2><Link to="https://github.com/k0michi/hipt">hipt (Hierarchically Indented Plain Text)</Link></h2>
        <div className='meta'>
          Built with TypeScript
        </div>
        <p>インデントされたテキストをパースするライブラリ。</p>
      </div>
    </>
  );
}