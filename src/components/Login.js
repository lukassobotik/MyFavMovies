import Layout from "./Layout";
import {useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {UserAuth} from "../context/AuthContext";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const {logIn} = UserAuth();
    const history = useHistory();

    document.onmousedown = () => {
        return true;
    };

    function setUsernameHandler(evt) {
        setEmail(evt.target.value);
    }

    function setPasswordHandler(evt) {
        setPassword(evt.target.value);
    }

    const login = async (e) => {
        e.preventDefault();
        try {
            await (logIn(email, password)).then(() => {
                history.push('/');
            }).catch((error) => {
                setError(error.message);
            });
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    }

    return <Layout>
        <div className="login-panel">
            <div className="text-4xl text-center font-bold mb-5">Log In</div>
            {error ? <p className=''>{error.toString()} </p> : null}
            <input className="text_field" type="text" placeholder="Email" onChange={setUsernameHandler} value={email}/>
            <p></p>
            <input className="text_field" type="password" placeholder="Password" onChange={setPasswordHandler} value={password}/>
            <p></p>
            <button className="login-btn button" onClick={login}>Log In</button>
            <div className="mt-5"><Link to="/signup">Sign Up</Link></div>
        </div>
    </Layout>;
}