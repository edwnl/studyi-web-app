import React, { useContext, Suspense, useEffect, lazy } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import routes from "../../routes";

import Sidebar from "../Sidebar";
import DashboardHeader from "../Headers/DashboardHeader";
import DashboardContainer from "./DashboardContainer";
import LoadingPage from "../Misc/LoadingPage";
import { SidebarContext } from "../../utils/context/SidebarContext";

const Page404 = lazy(() => import("../../pages/404"));

function DashboardLayout() {
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  let location = useLocation();

  useEffect(() => {
    closeSidebar();
  }, [location]);

  return (
    <div
      className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${
        isSidebarOpen && "overflow-hidden"
      }`}
    >
      <Sidebar />

      <div className="flex flex-col flex-1 w-full">
        <DashboardHeader />
        <DashboardContainer>
          <Suspense fallback={<LoadingPage />}>
            <Switch>
              {routes.map((route, i) => {
                return route.component ? (
                  <Route
                    key={i}
                    exact={true}
                    path={`/app${route.path}`}
                    render={(props) => <route.component {...props} />}
                  />
                ) : null;
              })}
              <Route component={Page404} />
            </Switch>
            {/*<Redirect from ="/app" to="/app/dashboard" />*/}
          </Suspense>
        </DashboardContainer>
      </div>
    </div>
  );
}

export default DashboardLayout;
