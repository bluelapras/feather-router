import React, { memo, createContext, useReducer, useEffect, Dispatch } from "react";
import { RouteData } from "./route";
import { useBrowserPath } from "./useBrowserLocation";

interface RouterProps {
  initialPath?: string | undefined; // Used to set the initial URL pathname (Useful for SSR).
  children?: React.ReactNode;
}
/**
 * <Router /> Top level component which handles routing logic
 *
 * @example
 * <Router>
 *  <Route path="/home" component={HomePage} />
 *  <Route path="/blog" component={BlogPage}>
 *    <Route path="[id]" component={BlogPage} /> // By default, router will inject id as a prop into BlogPage
 *    <Route path="/new/[id]" component={CreateBlogPage} inject={false} /> // TODO
 *  </Route>
 * </Router>
 *
 */
function Router({ initialPath, ...props }: RouterProps) {
  // Investigate if memo has any benfits here, as Router should not typically be re-rendered (It is safe to do so, but it may be a rare occurrence)

  // Check if we are running in a non-browser env (This is to help developers who are implementing SSR)
  if (typeof window === "undefined" && initialPath === undefined) {
    console.error(
      "[feather-router] - WARN: <Router /> was rendered in a non-browser environment. The initial URL has been set to '/' which may have unexpected results. If you are implementing SSR, provide the initialURL in order to render the correct route."
    );
  }

  // Store the child route data
  const [routerState, dispatch] = useReducer(RouterContextReducer, {
    routes: [],
    matchedRouteData: {
      routeID: null,
      routeParams: undefined,
    },
    dispatch: null,
  });

  // Hook which stores the current browser path
  const [browserPath] = useBrowserPath();

  // When the routes or browserPath changes, determine the correct Route to render
  useEffect(() => {
    // Handle matching
    const routeMatchData: { routeID: number | null; routeParams: object | undefined; routeType: string } = {
      // null is interpreted as no matches found (this is different from the /* 404 wildcard, as the /* 404 will still match.
      // If a /* 404 wildcard Route is created, then matchedRouteID will ALWAYS be NON-NULL.
      // The only case in which matchedRouteID can be null is if no /* 404 wildcard Route is defined.
      routeID: null,
      routeParams: undefined,
      routeType: "",
    };
    // Favour static route matches over dynamic route matches.
    routerState.routes.forEach((route) => {
      if (route.regex.test(browserPath)) {
        if (routeMatchData.routeID === null || routeMatchData.routeType !== "static") {
          routeMatchData.routeID = route.routeID;
          routeMatchData.routeParams = route.type === "static" ? undefined : browserPath.match(route.regex)?.groups;
          routeMatchData.routeType = route.type;
        }
      }
    });
    dispatch({
      type: "setMatchedRouteData",
      matchedRouteData: {
        routeID: routeMatchData.routeID,
        routeParams: routeMatchData.routeParams,
      },
    });
  }, [browserPath, routerState.routes]);

  return <RouterContext.Provider value={{ ...routerState, dispatch }}>{props.children}</RouterContext.Provider>;
}

// Router context
interface RouterContextState {
  routes: RouteData[];
  matchedRouteData: {
    routeID: number | null;
    routeParams: { [key: string]: never } | undefined;
  };
  dispatch: Dispatch<Action> | null;
}

type ActionTypes = "addRoute" | "removeRoute" | "setMatchedRouteData";
interface Action {
  type: ActionTypes;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
// Router reducer
const RouterContextReducer = (state: RouterContextState, action: Action): RouterContextState => {
  switch (action.type) {
    case "addRoute": {
      /** ACTION MUST CONTAIN: route KEY */
      return { ...state, routes: [...state.routes, action.route] };
    }
    case "removeRoute": {
      /** ACTION MUST CONTAIN: routeID KEY */
      return { ...state, routes: state.routes.filter((route) => route.routeID !== action.routeID) };
    }
    case "setMatchedRouteData": {
      /** ACTION MUST CONTAIN matchedRouteData KEY */
      return { ...state, matchedRouteData: action.matchedRouteData };
    }
  }
};

const RouterContext = createContext<RouterContextState>(null as unknown as RouterContextState);

const RouterMemo = memo(Router);

export { RouterMemo as Router, RouterContext };
