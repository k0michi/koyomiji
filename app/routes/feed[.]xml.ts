import ServerModel from "lib/ServerModel";
import { Route } from "./+types/feed[.]xml";

export async function loader({
  params,
}: Route.LoaderArgs) {
  return new Response(await ServerModel.instance.getFeedAsString(), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml'
    },
  });
}