import { Link, LoaderFunctionArgs, MetaFunction, useLoaderData, useLocation } from 'react-router';
import ServerModel from 'lib/ServerModel';
import { getMeta } from 'lib/meta';
import DateHelper from 'lib/DateHelper';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const index = await ServerModel.instance.getEntryIndex();
  return { entries: index };
}

type Data = Awaited<ReturnType<typeof loader>>;

export const meta: MetaFunction = ({ location }) => getMeta({
  location,
  title: "Photographs",
  description: "スナップ写真など。"
});

export default function PhotoIndexPage() {
  const data = useLoaderData() as Data;
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