import { LoaderFunctionArgs, MetaFunction, useLoaderData, useLocation, useParams } from 'react-router';
import { CalenderIcon, CameraIcon, RefreshIcon } from '../../components/icon';
import { toDisplayDateString } from '../../lib/DateFormat.index';
import ServerModel from 'lib/ServerModel';
import { getMeta } from 'lib/meta';
import KTMLHelper from '~/KTMLHelper';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  return await ServerModel.instance.getEntry(`/photograph/${params.id}`);
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

export default function PhotographPage() {
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
          <div className="date"><RefreshIcon /><div>{toDisplayDateString(new Date(entry.modified))}</div></div>
          <div className="date"><CameraIcon /><div>{toDisplayDateString(new Date(entry.taken!))}</div></div>
        </div>
      </header>
      <div id="body">
        {KTMLHelper.parseAsReact(entry.content!)}
      </div>
    </>
  );
}