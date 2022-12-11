import Layout from "../Layout";
import {useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {Alert} from "@mui/material";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../../firebase";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
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
            await (signInWithEmailAndPassword(auth, email, password)).then(() => {
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
            {error ? <Alert className="mb-2" variant="filled" severity="error">{error.toString()}</Alert> : null}
            <input className="text_field w-full" type="text" placeholder="Email" onChange={setUsernameHandler} value={email}/>
            <p></p>
            <input className="text_field w-full" type="password" placeholder="Password" onChange={setPasswordHandler} value={password}/>
            <p></p>
            <button className="login-btn button" onClick={login}>Log In</button>
            <div className="mt-5"><Link to="/signup/">Sign Up</Link></div>
        </div>
    </Layout>;
}