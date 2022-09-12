import * as React from 'react';
import { useModel, useObservable } from 'kyoka';
import { Model } from '../model.js';
import { useLocation } from 'react-router';
import { parseXML, toElement } from '../xml.js';
import { reactFactory } from '../react-kdml.js';
import Head from '../components/head.js';

export default function DictionaryPage() {
  const location = useLocation();
  const url = `https://koyomiji.com${location.pathname}`;
  const model = useModel<Model>();
  const dictionaries = useObservable(model.dictionaries);
  const entries = dictionaries != null ? Object.values(dictionaries).flatMap(d => d.content) : [];
  entries.reverse();

  React.useEffect(() => {
    model.fetchDictionary();
  }, []);

  return (
    <>
      <Head url={url} title="Dictionary" description="私的な英単語帳。" />
      <header>
        <h1>Dictionary</h1>
        <div className="meta">私的な英単語帳。</div>
      </header>
      <div id="body">
        {
          entries.map(e =>
            <div className='dictionary-entry'>
              <h2>{e?.word}</h2>
              {e?.senses.map(s => {
                const usage = s.usage != null ? toElement(parseXML(s.usage).firstChild?.childNodes!, reactFactory) : null;
                const gloss = s.gloss != null ? toElement(parseXML(s.gloss).firstChild?.childNodes!, reactFactory) : null;
                return <div><span className='pos'>{s.pos}.</span> <span className='usage'>{usage}</span> <span className='gloss'>{gloss}</span></div>;
              })}
            </div>
          )
        }
      </div>
    </>
  );
}