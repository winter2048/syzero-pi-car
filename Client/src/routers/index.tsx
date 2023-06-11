import { RouteObject, useRoutes } from "react-router-dom";
import React, { lazy } from "react";
import { Spinner } from "@fluentui/react-components";
// react懒加载
const App = lazy(() => import("../pages/app"));
const Control = lazy(() => import("../pages/app/control"));
const Test = lazy(() => import("../pages/app/test"));
const Text = lazy(() => import("../pages/app/text"));
const Setting = lazy(() => import("../pages/app/setting"));

const router: Array<RouteObject> = [
  {
    path: "/",
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
          <App />
      </React.Suspense>
    ),
    children: [
      {
        path: "control",
        element: (
          <React.Suspense fallback={<Spinner/>}>
            <Control />
          </React.Suspense>
        ),
      },
      {
        path: "test",
        element: (
          <React.Suspense fallback={<Spinner/>}>
            <Test />
          </React.Suspense>
        ),
      },
      {
        path: "text",
        element: (
          <React.Suspense fallback={<Spinner/>}>
            <Text />
          </React.Suspense>
        ),
      },
      {
        path: "setting",
        element: (
          <React.Suspense fallback={<Spinner/>}>
            <Setting />
          </React.Suspense>
        ),
      },
    ],
  }
];

function Routes() {
  return useRoutes(router);
}

export default Routes;
