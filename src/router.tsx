import React, { useState, useEffect, createContext } from "react";
import { generatePathRegex, routeType } from "./utils/generate-path-regex";
import { useBrowserPath } from "./useBrowserPath";

interface Route {
  path: string;
  component: React.FunctionComponent<unknown>;
}
interface ParsedRoute extends Route {
  regex: RegExp;
  type: "static" | "dynamic";
}
interface RouteMatch {
  route: ParsedRoute | null;
  params: object | null;
}
interface RouterProps {
  routes: Route[];
  staticPath?: string;
}
/**
 * Top level component which handles routing logic
 *
 * @example
 * <Router config={...} />
 *
 */
function Router({ routes, staticPath = "/" }: RouterProps) {
  // Current browser path
  const [browserPath] = useBrowserPath(staticPath);

  // Current route
  const [matchedRoute, setMatchedRoute] = useState<RouteMatch | null>(null);

  // Parse routes
  const PARSED_ROUTES: ParsedRoute[] = routes.map((route) => ({
    path: route.path,
    component: route.component,
    regex: generatePathRegex(route.path),
    type: routeType(route.path),
  }));

  // When the browserPath or routes changes, determine the correct Route to render
  useEffect(() => {
    let matchedRoute: ParsedRoute | null = null as unknown as ParsedRoute; // Cast since TS is unable to know that it is reassigned off null later.

    // Handle matching
    PARSED_ROUTES.forEach((parsedRoute) => {
      if (parsedRoute.regex.test(browserPath)) {
        if (matchedRoute === null) {
          matchedRoute = parsedRoute;
        } else if (parsedRoute.type === "static" && matchedRoute.type !== "static") {
          matchedRoute = parsedRoute;
        }
      }
    });

    setMatchedRoute({
      route: matchedRoute,
      params: matchedRoute === null ? null : browserPath.match(matchedRoute.regex)?.groups || null,
    });
  }, [PARSED_ROUTES, browserPath]);

  return (
    <RouterContext.Provider value={{ params: { ...(matchedRoute?.params || null) } }}>
      {matchedRoute?.route?.component && <matchedRoute.route.component {...matchedRoute.params} />}
    </RouterContext.Provider>
  );
}

interface RouterContextState {
  params: object | null;
}
const RouterContext = createContext<RouterContextState>({ params: null });

export { Router, RouterContext };
