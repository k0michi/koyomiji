import { Link, LoaderFunctionArgs, MetaFunction, useLoaderData, useLocation } from 'react-router';
import ServerModel from 'lib/ServerModel';
import { getMeta } from 'lib/meta';

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

function compareDates(a: string, b: string): number;
function compareDates(a: Date, b: Date): number;
function compareDates(a: any, b: any) {
  if (typeof a === 'string') {
    a = new Date(a);
  }

  if (typeof b === 'string') {
    b = new Date(b);
  }

  return a.valueOf() - b.valueOf();
}

export default function PhotoIndexPage() {
  const data = useLoaderData() as Data;
  const entries = Object.values(data.entries).filter(e => e.path.startsWith('/photograph'));
  entries.sort((a, b) => compareDates(b.taken!, a.taken!));

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