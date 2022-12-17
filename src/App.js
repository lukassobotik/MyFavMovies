import {Redirect, Route, Switch} from 'react-router-dom';
import { lazy, Suspense } from "react";
import Browse from "./components/Browse Route/Browse";
import AccountProtectedRoute from "./components/Account Route/AccountProtectedRoute";
import Account from "./components/Account Route/Account";
import Settings from "./components/Settings";

const SignUp = lazy(() => import("./components/Account Route/SignUp"));
const Login = lazy(() => import("./components/Account Route/Login"));
const Search = lazy(() => import("./components/Search"));
const MediaPage = lazy(() => import("./components/Movie Route/MediaPage"));
const MovieReleases = lazy(() => import("./components/Movie Route/MovieReleases"));
const Collection = lazy(() => import("./components/CollectionPage"));
const PersonPage = lazy(() => import("./components/PersonPage"));

function App() {
    document.onmousedown = () => {
        return true;
    };

    return (
        <div className="App">
            <Switch>
                <Route path="/" exact>
                    <Redirect to="/browse/"/>
                </Route>
                <Route path="/login/" exact>
                    <Suspense fallback={<div>Loading...</div>}><Login/></Suspense>
                </Route>
                <Route path="/signup/" exact>
                    <Suspense fallback={<div>Loading...</div>}><SignUp/></Suspense>
                </Route>
                <Route path="/browse/" exact>
                    <Browse/>
                </Route>
                <Route path="/account" exact>
                    <AccountProtectedRoute><Account/></AccountProtectedRoute>
                </Route>
                <Route path="/settings/" exact>
                    <AccountProtectedRoute><Settings/></AccountProtectedRoute>
                </Route>
                <Route path="/search/:searchParams/">
                    <Suspense fallback={<div>Loading...</div>}><Search/></Suspense>
                </Route>
                <Route path="/movie/:movieId/" exact>
                    <Suspense fallback={<div>Loading...</div>}><MediaPage/></Suspense>
                </Route>
                <Route path="/movie/:movieId/releases">
                    <Suspense fallback={<div>Loading...</div>}><MovieReleases/></Suspense>
                </Route>
                <Route path="/tv/:televisionId/" exact>
                    <Suspense fallback={<div>Loading...</div>}><MediaPage/></Suspense>
                </Route>
                <Route path="/collection/:collectionId/" exact>
                    <Suspense fallback={<div>Loading...</div>}><Collection/></Suspense>
                </Route>
                <Route path="/person/:personId/" exact>
                    <Suspense fallback={<div>Loading...</div>}><PersonPage/></Suspense>
                </Route>
            </Switch>
        </div>
    );
}

export default App;