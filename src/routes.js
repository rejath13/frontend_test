import React, { Suspense, Fragment, lazy } from "react";
import { Switch, Redirect, Route } from "react-router-dom";

import Loader from "./components/Loader/Loader";
import AdminLayout from "./layouts/AdminLayout";

import GuestGuard from "./components/Auth/GuestGuard";
import AuthGuard from "./components/Auth/AuthGuard";

import { BASE_URL } from "./config/constant";
import isAuthorized from "./middleware/auth";
import loginCheck from "./middleware/loginCheck";


const loginUserId = localStorage.getItem("loginUserId");

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Switch>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Component = route.component;

        const path = route.path.slice(1);

        // console.log(path);
        // console.log(loginUserId);
        // console.log('isAuthorized:' , isAuthorized(path, loginUserId));

        if (isAuthorized(path, loginUserId)) {
          // console.log('Authorized.. going to render')
          return (
            <Route
              key={i}
              path={route.path}
              exact={route.exact}
              render={(props) => (
                <Guard>
                  <Layout>
                    {route.routes ? (
                      renderRoutes(route.routes)
                    ) : (
                      <Component {...props} />
                    )}
                  </Layout>
                </Guard>
              )}
            />
          );
        } else {
          console.log("This person is not authorized");
          return (
            <Route
              key="1"
              path={routes[0].path}
              exact={routes[0].exact}
              render={(props) => (
                <Guard>
                  <Layout>
                    <Component {...props} />
                  </Layout>
                </Guard>
              )}
            />
          );
        }
      })}
    </Switch>
  </Suspense>
);

const routes = [
  {
    exact: true,
    guard: GuestGuard,
    path: "/",
    component: lazy(() => import("./views/auth/signin/SignIn")),
  },

  {
    path: "*",
    layout: AdminLayout,
    guard: AuthGuard,
    routes: [
      {
        exact: true,
        path: "/dashboard",
        component: lazy(() => import("./views/dashboard")),
      },

      {
        exact: true,
        path: "/customers",
        component: lazy(() => import("./views/customers/customers")),
      },
      {
        exact: true,
        path: "/securepath",
        component: lazy(() => import("./views/secure-path/SecurePathWrapper")),
      },
      {
        exact: true,
        path: "/securepath-vehicles",
        component: lazy(() => import("./views/secure-path/SecureVehicleWrapper")),
      },
      {
        exact: true,
        path: "/subscription",
        component: lazy(() => import("./views/subscription/subscription")),
      },

      {
        exact: true,
        path: "/subscription-due",
        component: lazy(() =>
          import("./views/subscription-due/subscription-due")
        ),
      },

      {
        exact: true,
        path: "/monitoring-due",
        component: lazy(() => import("./views/monitoring-due/monitoring-due")),
      },

      {
        exact: true,
        path: "/training",
        component: lazy(() => import("./views/training/training")),
      },

      {
        exact: true,
        path: "/blocked-accounts",
        component: lazy(() =>
          import("./views/blocked-accounts/blocked-accounts")
        ),
      },
      {// jobs-sandeep
        exact: true,
        path: "/jobs",
        component: lazy(() => import("./views/jobs-sandeep/JobsSandeep")),
      },
      {
        exact: true,
        path: "/scheduler",
        key: window.location.pathname,
        component: lazy(() => import("./views/scheduler/Scheduler")),
        // component: <Scheduler />,
      },
      // {
      //   exact: true,
      //   path: "/mail-sandeep",
      //   component: lazy(() => import("./views/mail-sandeep/MailSandeep")),
      // },

      // {
      //   exact: true,
      //   path: "/jobs",
      //   component: lazy(() => import("./views/jobs/jobs")),
      // },

      // {
      //   exact: true,
      //   path: "/schedule",
      //   component: lazy(() => import("./views/schedule/schedule")),
      // },

      {
        exact: true,
        path: "/mail",
        component: lazy(() => import("./views/mail/mail")),
      },

      {
        exact: true,
        path: "/vehicles",
        component: lazy(() => import("./views/vehicles/vehicle")),
      },

      {
        exact: true,
        path: "/salesplus",
        component: lazy(() => import("./views/sales-plus/salesplus")),
      },

      {
        exact: true,
        path: "/cold-call",
        component: lazy(() => import("./views/cold-call/cold-call")),
      },

      {
        exact: true,
        path: "/door-door",
        component: lazy(() => import("./views/door-door/door-door")),
      },

      {
        exact: true,
        path: "/door-report",
        component: lazy(() => import("./views/door-door/door-report")),
      },

      {
        exact: true,
        path: "/door-door-data",
        component: lazy(() => import("./views/door-door/door-manage")),
      },

      {
        exact: true,
        path: "/customer-service",
        component: lazy(() =>
          import("./views/customer-service/customer-service")
        ),
      },

      {
        exact: true,
        path: "/items",
        component: lazy(() => import("./views/items/items")),
      },
      {
        exact: true,
        path: "/itc",
        component: lazy(() => import("./views/itc/itc")),
      },
      {
        exact: true,
        path: "/sim-management",
        component: lazy(() => import("./views/sim-management/sim-management")),
      },
       // Payments rishikesh 
       {
        exact : true, 
        path:"/payments",
        component : lazy(()=> import("./views/payments/Payments"))
      }

      // {
      //   path: '*',
      //   exact: true,
      //   component: () => <Redirect to={BASE_URL}/>
      // }
    ],
  },
];

export default routes;
