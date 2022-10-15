import Layout from "./Layout";
import {useEffect, useState} from "react";
import {getAuth, updateProfile} from "firebase/auth";
import {Alert, Collapse, IconButton} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

export default function Settings() {
    const [pfpUrl, setPfpUrl] = useState('');
    const [isPfpUrlFocused, setIsPfpUrlFocused] = useState(false);
    const auth = getAuth();
    const [successAlert, setSuccessAlert] = useState('');
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
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
            setSuccessAlert("Successfully Saved!");
            setOpen(true);
        }).catch((error) => {
            console.log(error);
            setError(error.message);
        })
    }

    return (
        <Layout>
            <div className="settings-panel w-[75%]">
                <div className="text-left font-bold mb-2">Profile Picture URL</div>
                <input className="text_field w-full" type="text" placeholder="Photo URL" onChange={setPfpUrlHandler} value={pfpUrl} onFocus={() => {setIsPfpUrlFocused(true)}}/>
                <button className="settings-btn button" onClick={save}>Save</button>
                {successAlert ? <Collapse in={open}><Alert className="mt-2" variant="filled" severity="success" action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setOpen(false);
                        }}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }>{successAlert.toString()}</Alert></Collapse> : null}
                {error ? <Alert className="mt-2" variant="filled" severity="error">{error.toString()}</Alert> : null}
            </div>
        </Layout>
    )
}