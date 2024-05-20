import React, { Suspense, Fragment, lazy } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import Loader from "./components/Loader/Loader";
import AdminLayout from "./layouts/AdminLayout";

import GuestGuard from "./components/Auth/GuestGuard";
import AuthGuard from "./components/Auth/AuthGuard";

import { BASE_URL } from "./config/constant";

const loginUserId = localStorage.getItem('loginUserId');

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Switch>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Component = route.component;

        const path = route.path.slice(1);

        if( path==='' || (path==='dashboard' && (loginUserId==='1' || loginUserId==='5')) || (path==='customers' && (loginUserId==='1' || loginUserId==='2' || loginUserId==='3' || loginUserId==='4' || loginUserId==='5' || loginUserId==='7' || loginUserId==='8')) || (path==='subscription' && (loginUserId==='1' || loginUserId==='2' || loginUserId==='3' || loginUserId==='4' || loginUserId==='5' || loginUserId==='7' || loginUserId==='8')) || (path==='subscription-due' && (loginUserId==='1' || loginUserId==='3' || loginUserId==='5' || loginUserId==='7')) || (path==='monitoring-due' && (loginUserId==='1' || loginUserId==='3' || loginUserId==='5')) || (path==='training' && (loginUserId==='1' || loginUserId==='5' || loginUserId==='8')) || (path==='blocked-accounts' && (loginUserId==='1' || loginUserId==='2' || loginUserId==='3' || loginUserId==='4' || loginUserId==='5' || loginUserId==='6' || loginUserId==='7' || loginUserId==='8')) || (path==='jobs' && (loginUserId==='1' || loginUserId==='2' || loginUserId==='5' || loginUserId==='7')) || (path==='schedule' && (loginUserId==='1' || loginUserId==='2' || loginUserId==='5' || loginUserId==='7')) || (path==='vehicles' && (loginUserId==='1' || loginUserId==='2' || loginUserId==='3' || loginUserId==='4' || loginUserId==='5' || loginUserId==='7' || loginUserId==='8')) || (path==='items' && (loginUserId==='1' || loginUserId==='5'))  || (path==='cold-call' && (loginUserId==='1' || loginUserId==='5')) || (path==='cold-call' && (loginUserId==='1' || loginUserId==='5')) ){

          return (
            <Route
              key={i}
              path={route.path}
              exact={route.exact}
              render={(props) => (
                <Guard>
                  <Layout>
                    {route.routes
                      ? renderRoutes(route.routes)
                      : <Component {...props} />}
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
    path: '/',
    component: lazy(() => import('./views/auth/signin/SignIn'))
  },  
  
  {
    path: '*',
    layout: AdminLayout,
    guard: AuthGuard,
    routes: [
      {
        exact: true,
        path: '/dashboard',
        component: lazy(() => import('./views/dashboard'))
      },

      {
        exact: true,
        path: '/customers',
        component: lazy(() => import('./views/customers/customers'))
      },

      {
        exact: true,
        path: '/subscription',
        component: lazy(() => import('./views/subscription/subscription'))
      },

      {
        exact: true,
        path: '/subscription-due',
        component: lazy(() => import('./views/subscription-due/subscription-due'))
      },

      {
        exact: true,
        path: '/monitoring-due',
        component: lazy(() => import('./views/monitoring-due/monitoring-due'))
      },

      {
        exact: true,
        path: '/training',
        component: lazy(() => import('./views/training/training'))
      },

      {
        exact: true,
        path: '/blocked-accounts',
        component: lazy(() => import('./views/blocked-accounts/blocked-accounts'))
      },

      {
        exact: true,
        path: '/jobs',
        component: lazy(() => import('./views/jobs/jobs'))
      },

      {
        exact: true,
        path: '/schedule',
        component: lazy(() => import('./views/schedule/schedule'))
      },

      {
        exact: true,
        path: '/vehicles',
        component: lazy(() => import('./views/vehicles/vehicle'))
      },

      {
        exact: true,
        path: '/cold-call',
        component: lazy(() => import('./views/cold-call/cold-call'))
      },

      // {
      //   exact: true,
      //   path: '/offline-vehicles',
      //   component: lazy(() => import('./views/offline-vehicles/offline-vehicles'))
      // },

      {
        exact: true,
        path: '/items',
        component: lazy(() => import('./views/items/items'))
      },

      // {
      //   path: '*',
      //   exact: true,
      //   component: () => <Redirect to={BASE_URL}/>
      // }
    ]
  }
];

export default routes;
