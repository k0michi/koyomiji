import { LoaderFunctionArgs } from "react-router";
import * as mimeTypes from 'mime-types';
import { ServerModel } from "lib/server-model";

export async function loader({
  params,
}: LoaderFunctionArgs) {
  const logID = params.id!;
  const assetPath = params.asset!;
  let asset: Uint8Array;

  try {
    asset = await ServerModel.instance.readFile(`log/${logID}/${assetPath}`);
  } catch (e) {
    return new Response('Not found', { status: 404 });
  }

  const headers: HeadersInit = {};
  const mime = mimeTypes.lookup(assetPath);

  if (mime) {
    headers['Content-Type'] = mime;
  }

  return new Response(asset, {
    status: 200,
    headers,
  });
}