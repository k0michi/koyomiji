import { LoaderFunctionArgs, MetaFunction, useLoaderData } from 'react-router';
import ServerModel from 'lib/ServerModel';
import { getMeta } from 'lib/meta';
import KTML from '../../components/KTML';
import { Route } from './+types/_common.dictionary';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  return await ServerModel.instance.getDictionary('/dictionary/english');
}

export const meta = ({ location }: Route.MetaArgs) => getMeta({
  location,
  title: "Dictionary",
  description: "私的な英単語帳。"
});

export default function DictionaryPage() {
  const dictionaries = useLoaderData<typeof loader>();
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
                  const usage = s.usage != null ? <KTML content={s.usage} /> : null;
                  const gloss = s.gloss != null ? <KTML content={s.gloss} /> : null;
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