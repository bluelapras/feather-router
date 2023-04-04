import React, { memo, createContext, useReducer, useEffect, Dispatch } from "react";
import { RouteData } from "./route";
import { useBrowserPath } from "./useBrowserLocation";

interface RouterProps {
  children?: React.ReactNode;
}

/**
 * Top level component which handles routing logic
 *
 * @example
 * <Router>
 *  <Route path="/home" component={HomePage} />
 *  <Route path="/blog" component={BlogPage}>
 *    <Route path="/[id]" component={BlogPage} /> // By default, router will inject id as a prop into BlogPage
 *    <Route path="/new/[id]" component={CreateBlogPage} />
 *  </Route>
 * </Router>
 *
 */
function Router({ ...props }: RouterProps) {
  // Store the child route data
  const [routerState, dispatch] = useReducer(RouterContextReducer, {
    routes: [],
    matchedRouteData: null,
    dispatch: null,
  });

  // Current browser path
  const [browserPath] = useBrowserPath();

  // When the browserPath or routes changes, determine the correct Route to render
  useEffect(() => {
    // Handle matching
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let routeMatchData: { routeID: number; routeParams: { [key: string]: any } | null; routeType: string } | null =
      null;
    // Favour static route matches over dynamic route matches.
    routerState.routes.forEach((route) => {
      if (route.regex.test(browserPath)) {
        if (routeMatchData === null || routeMatchData.routeType !== "static") {
          routeMatchData = {
            routeID: route.routeID,
            routeParams: browserPath.match(route.regex)?.groups || null, // undefined || null => null,
            routeType: route.type,
          };
        }
      }
    });
    dispatch({
      type: "setMatchedRouteData",
      matchedRouteData: routeMatchData,
    });
  }, [browserPath, routerState.routes]);

  return <RouterContext.Provider value={{ ...routerState, dispatch }}>{props.children}</RouterContext.Provider>;
}

// Router context
interface RouterContextState {
  routes: RouteData[];
  matchedRouteData: {
    routeID: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    routeParams: { [key: string]: any } | null; // null means no params
  } | null; // matchedRouteData === null means no matching route
  dispatch: Dispatch<Action> | null;
}

type Action = Action_AddRoute | Action_RemoveRoute | Action_SetMatchedRouteData;

interface Action_AddRoute {
  type: "addRoute";
  route: RouteData;
}

interface Action_RemoveRoute {
  type: "removeRoute";
  routeID: number;
}

interface Action_SetMatchedRouteData {
  type: "setMatchedRouteData";
  matchedRouteData: {
    routeID: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    routeParams: { [key: string]: any } | null;
  } | null;
}
// Router reducer
const RouterContextReducer = (state: RouterContextState, action: Action): RouterContextState => {
  switch (action.type) {
    case "addRoute": {
      return { ...state, routes: [...state.routes, action.route] };
    }
    case "removeRoute": {
      return { ...state, routes: state.routes.filter((route) => route.routeID !== action.routeID) };
    }
    case "setMatchedRouteData": {
      return { ...state, matchedRouteData: action.matchedRouteData };
    }
  }
};

const RouterContext = createContext<RouterContextState>(null as unknown as RouterContextState);

const RouterMemo = memo(Router);

export { RouterMemo as Router, RouterContext };
