import Layout from "./Layout";
import {useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {UserAuth} from "../context/AuthContext";
import {getAuth, updateProfile} from "firebase/auth"

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const {signUp} = UserAuth()
    const auth = getAuth();
    const history = useHistory();

    document.onmousedown = () => {
        return true;
    };

    function setUsernameHandler(evt) {
        setUsername(evt.target.value);
    }

    function setEmailHandler(evt) {
        setEmail(evt.target.value);
    }

    function setPasswordHandler(evt) {
        setPassword(evt.target.value);
    }

    const signup = async (e) => {
        e.preventDefault();
        try {
            await (signUp(email, password)).then(async () => {
                await updateProfile(auth.currentUser, {
                    displayName: username
                }).then(() => {
                    history.push('/');
                }).catch((error) => {
                    setError(error.message);
                })
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
            <div className="text-4xl text-center font-bold mb-5">Sign Up</div>
            {error ? <p className=''>{error.toString()} </p> : null}
            <input className="text_field" type="text" placeholder="Username" onChange={setUsernameHandler} value={username}/>
            <p></p>
            <input className="text_field" type="text" placeholder="Email" onChange={setEmailHandler} value={email}/>
            <p></p>
            <input className="text_field" type="password" placeholder="Password" onChange={setPasswordHandler} value={password}/>
            <p></p>
            <button className="login-btn button" onClick={signup}>Sign Up</button>
            <div className="mt-5"><Link to="/login">Log In</Link></div>
        </div>
    </Layout>;
}