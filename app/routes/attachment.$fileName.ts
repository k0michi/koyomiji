import { LoaderFunctionArgs } from "react-router";
import * as mimeTypes from 'mime-types';
import ServerModel from "lib/ServerModel";

export async function loader({
  params,
}: LoaderFunctionArgs) {
  const fileName = params.fileName!;
  let asset: Uint8Array;

  try {
    asset = await ServerModel.instance.getAttachmentFromExternalPath(`/attachment/${fileName}`);
  } catch (e) {
    return new Response('Not found', { status: 404 });
  }

  const headers: HeadersInit = {};
  const mime = mimeTypes.lookup(fileName);

  if (mime) {
    headers['Content-Type'] = mime;
  }

  return new Response(asset, {
    status: 200,
    headers,
  });
}