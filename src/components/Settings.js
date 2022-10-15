import Layout from "./Layout";
import {useEffect, useState} from "react";
import {getAuth, updateProfile} from "firebase/auth";

export default function Settings() {
    const [pfpUrl, setPfpUrl] = useState('');
    const [isPfpUrlFocused, setIsPfpUrlFocused] = useState(false);
    const auth = getAuth();
    console.log(auth.currentUser);

    document.onmousedown = () => {
        return true;
    };

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user && !isPfpUrlFocused) {
                setPfpUrl(auth.currentUser.photoURL);
                console.log(auth.currentUser);
            }
        });
    });

    function setPfpUrlHandler(evt) {
        setPfpUrl(evt.target.value);
    }

    async function save() {
        await updateProfile(auth.currentUser, {
            photoURL: pfpUrl
        }).then(() => {
            console.log("saved");
            console.log(auth.currentUser);
        }).catch((error) => {
            console.log(error);
        })
    }

    return (
        <Layout>
            <div className="login-panel">
                <h1>Settings</h1>
                <input className="text_field" type="text" placeholder="Photo URL" onChange={setPfpUrlHandler} value={pfpUrl} onFocus={() => {setIsPfpUrlFocused(true)}}/>
                <button className="login-btn button" onClick={save}>Save</button>
            </div>
        </Layout>
    )
}