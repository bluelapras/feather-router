import React, { memo, useEffect, useRef, createContext, useContext } from "react";
import { generateRouteID } from "./utils/generate-route-id";
import { generatePathRegex } from "./utils/generate-path-regex";
import { RouterContext } from "./router";

interface RouteProps {
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.FunctionComponent<any>;
  children?: React.ReactNode;
}

interface RouteData {
  type: "static" | "dynamic";
  routeID: number;
  path: string;
  regex: RegExp;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.FunctionComponent<any>;
}

/**
 * Route component
 */
function Route({ path, component: Component, ...props }: RouteProps) {
  // Generate a unique ID for the route
  // The unique ID reflects the order in which the Routes are declared
  const ORDERED_ROUTE_ID = useRef(generateRouteID());
  // Store the Router context
  const routerState = useContext(RouterContext);
  // Used to implement nested routes
  const routeState = useContext(RouteContext);
  const FULL_ROUTE_PATH = routeState.fullParentPath.concat(path);

  // Update the parent Router when the route is mounted / unmounted
  useEffect(() => {
    // Regex for detecting if the Route is dynamic
    const DYNAMIC_ROUTE_REGEX = /\/\[[^/]+?\]/;
    // Provide cleanup effect closure over the ref
    const ROUTE_ID_CLOSURE_VAR = ORDERED_ROUTE_ID.current;

    routerState.dispatch &&
      routerState.dispatch({
        type: "addRoute",
        route: {
          type: DYNAMIC_ROUTE_REGEX.test(FULL_ROUTE_PATH) ? "dynamic" : "static",
          routeID: ORDERED_ROUTE_ID.current,
          path: FULL_ROUTE_PATH,
          regex: generatePathRegex(FULL_ROUTE_PATH),
          component: Component,
        },
      });

    return () => {
      routerState.dispatch && routerState.dispatch({ type: "removeRoute", routeID: ROUTE_ID_CLOSURE_VAR });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [FULL_ROUTE_PATH, Component]); // Do not add routeState or an infinite loop will occur: Route updates Router, which updates Route.

  return (
    <>
      {
        ORDERED_ROUTE_ID.current === routerState.matchedRouteData.routeID && (
          <Component {...routerState.matchedRouteData.routeParams} />
        ) /* Render the component */
      }
      {props.children && (
        <RouteContext.Provider value={{ fullParentPath: FULL_ROUTE_PATH }}>
          {props.children /* The current route may have nested routes, which must stay rendered */}
        </RouteContext.Provider>
      )}
    </>
  );
}

/**
 * Route context which stores the URL of the parent Route component, or an empty string (""),
 * if there is no parent Route component.
 *
 * Each Route component provides a RouteContext, which contains the full parent path of the parent
 * In this case:
 * - The "/books" Route has a has no parent Route, and hence also has no parent RouteContext: fullParentPath = ""
 * - The "/[id]"" Route has a parent RouteContext: fullParentPath: fullParentPath = "/[id]"
 * - The "/purchase" Route has a parent RouteContext: "/books/[id]"
 * @example
 * <Router>
 *  <Route path="/books">
 *    <Route path="/[id]">
 *      <Route path="/purchase" />
 *    </Route>
 *  </Route>
 * </Router>
 *
 */

interface RouteContextState {
  fullParentPath: string;
}

const InitialState: RouteContextState = {
  fullParentPath: "",
};

const RouteContext = createContext<RouteContextState>(InitialState);

const RouteMemo = memo(Route);

export { RouteMemo as Route };

export type { RouteData };
