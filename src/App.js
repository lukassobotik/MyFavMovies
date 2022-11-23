import {Redirect, Route, Switch} from 'react-router-dom';
import './App.css';
import Login from "./components/Account Route/Login";
import Browse from "./components/Browse Route/Browse";
import SignUp from "./components/Account Route/SignUp";
import AccountProtectedRoute from "./components/Account Route/AccountProtectedRoute";
import Account from "./components/Account Route/Account";
import Settings from "./components/Settings";
import Movie from "./components/Movie Route/Movie";
import MovieReleases from "./components/Movie Route/MovieReleases";

function App() {
    document.onmousedown = () => {
        return false;
    };

    return (
        <div className="App">
            <Switch>
                <Route path="/" exact>
                    <Redirect to="/browse/"/>
                </Route>
                <Route path="/login/" exact>
                    <Login/>
                </Route>
                <Route path="/signup/" exact>
                    <SignUp/>
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
                <Route path="/movie/:movieId/" component={Movie} exact/>
                <Route path="/movie/:movieId/releases" component={MovieReleases}/>
            </Switch>
        </div>
    );
}

export default App;