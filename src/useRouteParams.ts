import { useContext } from "react";
import { RouterContext } from "./router";
function useRouteParams() {
  const routerState = useContext(RouterContext);
  return routerState.matchedRouteData.routeParams;
}

export { useRouteParams };
