import { Link, LoaderFunctionArgs, MetaFunction, useLoaderData, useLocation } from 'react-router';
import ServerModel from 'lib/ServerModel';
import { getMeta } from 'lib/meta';
import DateHelper from 'lib/DateHelper';
import { Route } from './+types/_common.photograph';

export const loader = async ({ params }: Route.LoaderArgs) => {
  const index = await ServerModel.instance.getEntryIndex();
  return { entries: index };
}

export const meta = ({ location, data }: Route.MetaArgs) => getMeta({
  location,
  title: "Photographs",
  description: "スナップ写真など。"
});

export default function PhotoIndexPage() {
  const data = useLoaderData<typeof loader>();
  const entries = Object.values(data.entries).filter(e => e.path.startsWith('/photograph'));
  entries.sort((a, b) => DateHelper.compareDates(b.taken!, a.taken!));

  return (
    <>
      <header>
        <h1>Photographs</h1>
        <div className="meta">スナップ写真など。</div>
      </header>
      <div id="body">
        <div className="thumbnail-list">
          {entries.map(i =>
            <div className="thumbnail" key={i.path}>
              <Link to={i.path}>
                <img src={i.source!} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}