import { useEffect } from "react";
import { useRevalidator } from "react-router";

export function useDevReload() {
  const { revalidate, state } = useRevalidator();

  if (import.meta.hot) {
    useEffect(() => {
      import.meta.hot?.on('koyomiji:update', (payload) => {
        revalidate();
      });
    }, []);
  }
}