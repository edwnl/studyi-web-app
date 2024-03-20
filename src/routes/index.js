import { lazy } from "react";
const Page404 = lazy(() => import("../pages/404"));
const Blank = lazy(() => import("../pages/About"));
const Profile = lazy(() => import("../pages/Profile"));
const Create = lazy(() => import("../pages/Create"));
const RevisionStart = lazy(() => import("../pages/RevisionStart"));
const RevisionInProgress = lazy(() => import("../pages/RevisionInProgress"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Topics = lazy(() => import("../pages/Topics"));

const routes = [
  {
    path: "/dashboard", // the url
    component: Dashboard, // view rendered
  },
  {
    path: "/topics",
    component: Topics,
  },
  {
    path: "/404",
    component: Page404,
  },
  {
    path: "/create",
    component: Create,
  },
  {
    path: "/profile",
    component: Profile,
  },
  {
    path: "/about",
    component: Blank,
  },
  {
    path: "/revise",
    component: RevisionStart,
  },
  {
    path: "/revise/:id",
    component: RevisionInProgress,
  },
];

export default routes;
