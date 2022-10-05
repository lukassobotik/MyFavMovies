import Layout from "./Layout";
import {useState} from "react";
import {useHistory} from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    function setUsernameHandler(evt) {
        setUsername(evt.target.value);
    }

    function setPasswordHandler(evt) {
        setPassword(evt.target.value);
    }

    function login() {
        fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json().then(res => {
            if (res.user) {
                setUsername('');
                setPassword('');
                history.push('/');
            }
        }))
    }

    return <Layout>
        <div className="login-panel">
            <h1>Log In</h1>
            <input type="text" placeholder="Username" onChange={setUsernameHandler} value={username}/>
            <p></p>
            <input type="password" placeholder="Password" onChange={setPasswordHandler} value={password}/>
            <p></p>
            <button onClick={login}>Log In</button>
        </div>
    </Layout>;
}