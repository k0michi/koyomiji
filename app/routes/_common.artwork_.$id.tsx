import { LoaderFunctionArgs, MetaFunction, useLoaderData, useLocation, useParams } from 'react-router';
import { CalenderIcon } from '../../components/icon';
import { toDisplayDateString } from '../../lib/date-format';
import { ServerModel } from 'lib/server-model';
import { getMeta } from 'lib/meta';
import KTMLHelper from '~/KTMLHelper';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  return await ServerModel.instance.getEntry(`/artwork/${params.id}`);
}

type Data = Awaited<ReturnType<typeof loader>>;

export const meta: MetaFunction = ({ location, data }) => getMeta({
  location,
  title: (data as Data).title,
  description: (data as Data).description,
  type: 'article',
  published: (data as Data).created,
  modified: (data as Data).modified,
});

export default function ArtworkPage() {
  const data = useLoaderData() as Data;
  const params = useParams();
  const entry = data;

  return (
    <>
      <img className="artwork" src={entry.source!} />
      <header>
        <h1>{entry.title}</h1>
        <div className="meta">
          <div className="number">#{params.id}</div>
          <div className="date"><CalenderIcon /><div>{toDisplayDateString(new Date(entry.created))}</div></div>
        </div>
      </header>
      <div id="body">
        {KTMLHelper.parseAsReact(entry.content!)}
      </div>
    </>
  );
}