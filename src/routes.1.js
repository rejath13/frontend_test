import { lazy } from "react";
import AdminLayout from "./layouts/AdminLayout";
import GuestGuard from "./components/Auth/GuestGuard";
import AuthGuard from "./components/Auth/AuthGuard";

export const routes = [
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
      {
        exact: true,
        path: "/sandeep",
        component: lazy(() => import("./views/jobs-sandeep/JobsSandeep")),
      },
      {
        exact: true,
        path: "/scheduler",
        component: lazy(() => import("./views/scheduler/Scheduler")),
      },
      // {
      //   exact: true,
      //   path: "/mail-sandeep",
      //   component: lazy(() => import("./views/mail-sandeep/MailSandeep")),
      // },
      {
        exact: true,
        path: "/jobs",
        component: lazy(() => import("./views/jobs/jobs")),
      },

      {
        exact: true,
        path: "/schedule",
        component: lazy(() => import("./views/schedule/schedule")),
      },

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
      // {
      //   path: '*',
      //   exact: true,
      //   component: () => <Redirect to={BASE_URL}/>
      // }
    ],
  },
];
