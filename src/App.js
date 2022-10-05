import {Redirect, Route, Switch} from 'react-router-dom';
import './App.css';
import Login from "./components/Login";
import useGlobalState from "./services/useGlobalState";
import Browse from "./components/Browse";

function App() {
  const {StateProvider} = useGlobalState();
  return (
    <StateProvider>
        <div className="App">
            <Switch>
                <Route path="/" exact>
                    <Redirect to="/browse" />
                </Route>
                <Route path="/login" exact>
                    <Login/>
                </Route>
                <Route path="/browse" exact>
                    <Browse/>
                </Route>
                <Route path="/movie/*" exact>

                </Route>
            </Switch>
        </div>
    </StateProvider>
  );
}

export default App;
