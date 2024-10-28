import * as React from 'react';
import { parseXML, toElement } from '../../lib/xml.js';
import { reactFactory } from '../../lib/react-kdml.js';
import { LoaderFunctionArgs, MetaFunction, useLoaderData } from 'react-router';
import { ServerModel } from 'lib/server-model.js';
import { getMeta } from 'lib/meta.js';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  return await ServerModel.instance.getDictionary('/dictionary/english');
}

type Data = Awaited<ReturnType<typeof loader>>;

export const meta: MetaFunction = ({ location }) => getMeta({
  location,
  title: "Dictionary",
  description: "私的な英単語帳。"
});

export default function DictionaryPage() {
  const dictionaries = useLoaderData() as Data;
  let entries = dictionaries.content!;
  entries = [...entries].reverse();

  return (
    <>
      <header>
        <h1>Dictionary</h1>
        <div className="meta">私的な英単語帳。</div>
      </header>
      <div id="body">
        {
          entries.map(e =>
            <div className='dictionary-entry' key={e.number}>
              <div className='head'>
                <h2>{e?.word}</h2>
                <div className="meta">
                  #{e?.number}
                </div>
              </div>
              <div className='senses'>
                {e?.senses.map(s => {
                  const usage = s.usage != null ? toElement(parseXML(s.usage).firstChild?.childNodes!, reactFactory) : null;
                  const gloss = s.gloss != null ? toElement(parseXML(s.gloss).firstChild?.childNodes!, reactFactory) : null;
                  // FIXME: Proper key instead of gloss
                  return <div key={s.gloss}><span className='pos'>{s.pos}.</span> <span className='usage'>{usage}</span> <span className='gloss'>{gloss}</span></div>;
                })}
              </div>
            </div>
          )
        }
      </div>
    </>
  );
}