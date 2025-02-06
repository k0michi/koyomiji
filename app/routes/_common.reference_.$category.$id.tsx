import { LoaderFunctionArgs, MetaFunction, useLoaderData, useLocation, useParams, useRouteLoaderData } from 'react-router';
import { CalenderIcon, RefreshIcon, TagsIcon } from '../../components/icon';
import { toDisplayDateString } from '../../lib/DateFormat.index';
import { getCategory } from '../../lib/SiteConfig';
import ServerModel from 'lib/ServerModel';
import { getMeta } from 'lib/meta';
import KTMLHelper from '~/KTMLHelper';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  return await ServerModel.instance.getEntry(`/reference/${params.category}/${params.id}`);
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

export default function ReferencePage() {
  const data = useLoaderData() as Data;
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
        {KTMLHelper.parseAsReact(entry.content!)}
      </div>
    </>
  );
}