import React, { lazy } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import AccessibleNavigationAnnouncer from "./components/Misc/AccessibleNavigationAnnouncer";
import { useAuth } from "./utils/useAuthHook";

const Layout = lazy(() => import("./components/Containers/DashboardLayout"));
const Login = lazy(() => import("./pages/LoginPage"));
const CreateAccount = lazy(() => import("./pages/SignUp"));
const LandingPage = lazy(() => import("./pages/LandingPage"));

export const AuthenticatedRoute = ({ component: C, ...props }) => {
  const { user } = useAuth();
  return (
    <Route
      {...props}
      render={(routeProps) =>
        user ? <C {...routeProps} /> : <Redirect excat to="/login" />
      }
    />
  );
};

const UnauthenticatedRoute = ({ component: C, ...props }) => {
  const { user } = useAuth();

  return (
    <Route
      {...props}
      render={(routeProps) =>
        !user ? <C {...routeProps} /> : <Redirect excat to="/app/dashboard" />
      }
    />
  );
};

function App() {
  return (
    <>
      <Router>
        <AccessibleNavigationAnnouncer />
        <Switch>
          <UnauthenticatedRoute excat path="/login" component={Login} />
          <UnauthenticatedRoute excat path="/create-account" component={CreateAccount}/>
          <AuthenticatedRoute path="/app" component={Layout} />
          <Route excat path="/" component={LandingPage} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
