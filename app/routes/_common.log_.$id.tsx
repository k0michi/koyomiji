import * as React from 'react';
import { LoaderFunctionArgs, MetaFunction, useLoaderData, useLocation, useParams } from 'react-router';
import { toElement } from '../../lib/xml';
import { parseXML } from '../../lib/xml';
import * as ReactKTML from '../../lib/react-ktml';
import { CalenderIcon } from '../../components/icon';
import { toDisplayDateString } from '../../lib/date-format';
import { ServerModel } from 'lib/server-model';
import { getMeta } from 'lib/meta';
import ReactNodeWriter from 'lib/visitor/ReactNodeWriter';
import ReactFragmentWriter from 'lib/visitor/ReactFragmentWriter';
import KTMLReactTransformer from 'lib/KTMLReactTransformer';
import XMLDocumentFragmentReader from 'lib/visitor/XMLDocumentFragmentReader';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  return await ServerModel.instance.getEntry(`/log/${params.id}`);
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

export default function LogPage() {
  const data = useLoaderData() as Data;
  const params = useParams();
  const entry = data;
  // const content = toElement(parseXML(entry.content!).firstChild?.childNodes!, ReactKTML.reactFactory);

  const writer = new ReactFragmentWriter();
  const transformer = new KTMLReactTransformer(writer);
  const reader = XMLDocumentFragmentReader.fromString(entry.content!);
  reader.accept(transformer);

  return (
    <>
      <header>
        <h1>{entry.title}</h1>
        <div className="meta">
          <div className="number">#{params.id}</div>
          <div className="date"><CalenderIcon /><div>{toDisplayDateString(new Date(entry.created))}</div></div>
        </div>
      </header>
      <div id="body">
        {writer.toReactNode()}
      </div>
    </>
  );
}