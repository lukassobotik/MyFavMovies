import {Redirect, Route, Switch} from 'react-router-dom';
import './App.css';
import Login from "./components/Login";
import Browse from "./components/Browse";

function App() {
    document.onmousedown = () => {
        return false;
    };
    return (
        <div className="App">
            <Switch>
                <Route path="/" exact>
                    <Redirect to="/browse"/>
                </Route>
                <Route path="/login/" exact>
                    <Login/>
                </Route>
                <Route path="/browse" exact>
                    <Browse/>
                </Route>
                <Route path="/movie/*" exact>
                    <h1>Movie</h1>
                </Route>
            </Switch>
        </div>
    );
}

export default App;