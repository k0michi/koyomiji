import * as React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router';

export default function AboutPage() {
  const location = useLocation();
  const url = `https://koyomiji.com${location.pathname}`;

  return (
    <>
      <Helmet>
        <title>About | 曆路喫茶館</title>
        <meta name="description" content="" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content="About" />
        <meta property="og:description" content="" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@k0michi" />
      </Helmet>
      <h1>About</h1>
      <h2>管理人について</h2>
      <p>管理人: Komichi*</p>
      <p>情報技術や英語、数学を学んでいます。</p>
      <p>最近の趣味は読書です。シャーロックホームズなど、推理小説が好きです。</p>
      <p>主にWebサイト、デスクトップアプリ、ゲームを開発しています。</p>
      <p>お絵描き練習中です。</p>
      <p>Administrator: Komichi*</p>
      <p>I'm a Japanese student and learning information technology, English and mathematics.</p>
      <p>My hobby is reading mysteries. I'm fond of Sherlock Holmes series.</p>
      <p>I mainly develop websites, desktop apps and games.</p>
      <p>I'm currently practicing drawing pictures.</p>
      <h2>サイトについて</h2>
      <p></p>
      <p><ruby>曆路<rp></rp><rt>こよみじ</rt><rp></rp></ruby>喫茶館といいます。</p>
      <p>特段の明記がない限り、サイト上のコンテンツは<a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>に準拠します。</p>
    </>
  );
}