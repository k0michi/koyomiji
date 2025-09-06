import ServerModel from "lib/ServerModel";
import { Route } from './+types/sitemap[.]xml';

export async function loader({
  params,
}: Route.LoaderArgs) {
  return new Response(await ServerModel.instance.getSitemapAsString(), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml'
    },
  });
}