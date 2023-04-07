import { useContext } from "react";
import { RouterContext } from "./router";
/**
 * Hook which provides access to the dynamic params of the route which is currently matched by the browser path.
 */
function useRouteParams() {
  const routerState = useContext(RouterContext);
  return routerState.params;
}

export { useRouteParams };
