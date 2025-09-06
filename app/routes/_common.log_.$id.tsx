import { useLoaderData, useParams } from 'react-router';
import { CalenderIcon, RefreshIcon } from '../../components/icon';
import { toDisplayDateString } from '../../lib/DateFormat.index';
import ServerModel from 'lib/ServerModel';
import { getMeta } from 'lib/meta';
import KTML from 'components/KTML';
import { Route } from './+types/_common.log_.$id';

export const loader = async ({ params }: Route.LoaderArgs) => {
  return await ServerModel.instance.getEntry(`/log/${params.id}`);
}

export const meta = ({ location, data }: Route.MetaArgs) => data ? getMeta({
  location,
  title: data.title,
  description: data.description,
  type: 'article',
  published: data.created,
  modified: data.modified,
}) : [];

export default function LogPage() {
  const data = useLoaderData<typeof loader>();
  const params = useParams();
  const entry = data;

  return (
    <>
      <header>
        <h1>{entry.title}</h1>
        <div className="meta">
          <div className="number">#{params.id}</div>
          <div className="date"><CalenderIcon /><div>{toDisplayDateString(new Date(entry.created))}</div></div>
          <div className="date"><RefreshIcon /><div>{toDisplayDateString(new Date(entry.modified))}</div></div>
        </div>
      </header>
      <div id="body">
        <KTML content={entry.content!} />
      </div>
    </>
  );
}