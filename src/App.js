import {Redirect, Route, Switch} from 'react-router-dom';
import './App.css';
import Login from "./components/Login";
import Browse from "./components/Browse";
import {AuthContextProvider} from "./context/AuthContext";
import SignUp from "./components/SignUp";
import AccountProtectedRoute from "./components/AccountProtectedRoute";
import Account from "./components/Account";
import Settings from "./components/Settings";
import {createTheme, ThemeProvider} from "@mui/material";
import Movie from "./components/Movie";
import MovieReleases from "./components/MovieReleases";

function App() {
    document.onmousedown = () => {
        return false;
    };

    const theme = createTheme({
        palette: {
            secondary: {
                main: '#FFFFFF'
            }
        }
    });

    return (
        <ThemeProvider theme={theme}>
            <AuthContextProvider>
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
            </AuthContextProvider>
        </ThemeProvider>
    );
}

export default App;