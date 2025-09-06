import { LoaderFunctionArgs, MetaFunction, useLoaderData, useLocation, useParams, useRouteLoaderData } from 'react-router';
import { CalenderIcon, RefreshIcon, TagsIcon } from '../../components/icon';
import { toDisplayDateString } from '../../lib/DateFormat.index';
import { getCategory } from '../../lib/SiteConfig';
import ServerModel from 'lib/ServerModel';
import { getMeta } from 'lib/meta';
import KTML from 'components/KTML';
import { Route } from './+types/_common.reference_.$category.$id';

export const loader = async ({ params }: Route.LoaderArgs) => {
  return await ServerModel.instance.getEntry(`/reference/${params.category}/${params.id}`);
}

export const meta = ({ location, data }: Route.MetaArgs) => data ?
  getMeta({
    location,
    title: data.title,
    description: data.description,
    type: 'article',
    published: data.created,
    modified: data.modified,
  }) : [];

export default function ReferencePage() {
  const data = useLoaderData<typeof loader>();
  const params = useParams();
  const entry = data;
  const categoryName = getCategory(params.category!).name;

  return (
    <>
      <header>
        <h1>{entry.title}</h1>
        <div className="meta">
          <div className="date"><CalenderIcon /><div>{toDisplayDateString(new Date(entry.created))}</div></div>
          <div className="date"><RefreshIcon /><div>{toDisplayDateString(new Date(entry.modified))}</div></div>
          <div className="tags"><TagsIcon /><div>{categoryName}</div></div>
        </div>
      </header>
      <div id="body">
        <KTML content={entry.content!} />
      </div>
    </>
  );
}