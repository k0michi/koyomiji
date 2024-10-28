import { LoaderFunctionArgs } from "react-router";
import { ServerModel } from "lib/server-model";

export async function loader({
  params,
}: LoaderFunctionArgs) {
  return new Response(await ServerModel.instance.getFeedAsString(), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml'
    },
  });
}