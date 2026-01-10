import * as mimeTypes from 'mime-types';
import ServerModel from "lib/ServerModel";
import { Route } from './+types/attachment.$fileName';

export async function loader({
  params,
}: Route.LoaderArgs) {
  const fileName = params.fileName!;
  let asset;

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