import React from "react";
import { useLoaderData } from "react-router";

// Fix for the issue that useLoaderData() returns undefined after location change
export function useBufferedData<T>() {
  const data = useLoaderData() as T;
  const [loadedData, setLoadedData] = React.useState<T>(data);

  React.useEffect(()=>{
    if (data != null) {
      setLoadedData(data);
    }
  },[data]);

  return loadedData;
}