import { getMeta } from 'lib/meta';
import { Link, MetaFunction } from 'react-router';
import profile from '../../assets/profile.png';

export const meta: MetaFunction = ({ location }) => getMeta({
  title: "About",
  description: "このサイトについて。",
  location
});

export default function AboutPage() {
  return (
    <>
      <header>
        <h1>About</h1>
        <div className="meta">このサイトについて。</div>
      </header>
      <div id="body">
        <div className='profile'>
          <img src={profile} />
          <div>
            <p className='name'>曆月こみち</p>
            <p className='id'>@k0michi</p>
          </div>
        </div>
        <p>当サイト、喫茶<ruby>曆路<rt>こよみじ</rt></ruby> を運営している、<ruby>曆月<rt>れきづき</rt></ruby>こみち と申します。このサイトは、私が気まぐれに勉強したことを書いたり、日記を書いたり、創作したりするための場所です。プログラミングや英語、数学について取り扱うことが多いです。レトロモダンなサイト作りを目標としています。</p>
        <p>私の趣味は、プログラムを書くこと、ブログを書くこと、絵を描くこと、本を読むこと、旅をすること、などです。やってみたいことは、小説を書くこと、作曲をすること、ゲームを作ることです。</p>
        <h2>ページについて</h2>
        <ul>
          <li><Link to="/project">Projects</Link>には、私が開発している/していたソフトウェアの紹介があります。</li>
          <li><Link to="/log">Logs</Link>は、私のブログです。取り止めのないことを書いています。</li>
          <li><Link to="/reference">Reference</Link>は、私が学んだことの備忘録です。</li>
          <li><Link to="/dictionary">Dictionary</Link>は、私が出逢った英単語をまとめた辞書です。</li>
          <li><Link to="/artwork">Artworks</Link>では、私が描いたイラストを置いています。</li>
        </ul>
        <h2>フィードについて</h2>
        <p>サイトのAtomフィードは<Link to="https://koyomiji.com/feed.xml">https://koyomiji.com/feed.xml</Link>にあります。このサイトの更新情報を、お好みのRSSリーダーで取得することが可能です。</p>
        <h2>お問い合せ</h2>
        <p><Link to="mailto:k0michi@koyomi.co">k0michi@koyomi.co</Link>まで。</p>
        <h2>技術構成について</h2>
        <p>当サイトの全てのページは、[React Router](https://reactrouter.com/)を使用して生成されています。サイトは[Vercel](https://vercel.com/)上でビルド、ホストされています。</p>
        <p>またサイト上のテキストは、XMLベースのフォーマットで記述されています。</p>
        <h2>ライセンスについて</h2>
        <p>特段の明記がない限り、サイト上のコンテンツは<Link to="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</Link>でライセンスされるものとします。</p>
      </div>
    </>
  );
}