import { LoaderFunctionArgs } from "react-router";
import ServerModel from "lib/ServerModel";

export async function loader({
  params,
}: LoaderFunctionArgs) {
  return new Response(await ServerModel.instance.getSitemapAsString(), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml'
    },
  });
}