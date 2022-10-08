import {Redirect, Route, Switch} from 'react-router-dom';
import './App.css';
import Login from "./components/Login";
import Browse from "./components/Browse";
import {AuthContextProvider} from "./context/AuthContext";
import SignUp from "./components/SignUp";
import AccountProtectedRoute from "./components/AccountProtectedRoute";
import Account from "./components/Account";

function App() {
    document.onmousedown = () => {
        return false;
    };
    return (
        <AuthContextProvider>
            <div className="App">
                <Switch>
                    <Route path="/" exact>
                        <Redirect to="/browse"/>
                    </Route>
                    <Route path="/login/" exact>
                        <Login/>
                    </Route>
                    <Route path="/signup/" exact>
                        <SignUp/>
                    </Route>
                    <Route path="/browse" exact>
                        <Browse/>
                    </Route>
                    <Route path="/account" exact>
                        <AccountProtectedRoute><Account/></AccountProtectedRoute>
                    </Route>
                    <Route path="/movie/*" exact>
                        <h1>Movie</h1>
                    </Route>
                </Switch>
            </div>
        </AuthContextProvider>
    );
}

export default App;