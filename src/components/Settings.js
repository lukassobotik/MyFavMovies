import Layout from "./Layout";
import React, {useEffect, useState} from "react";
import {getAuth, updateProfile} from "firebase/auth";
import {Alert, Collapse, IconButton, MenuItem, Select} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {doc, setDoc} from "firebase/firestore";
import {db} from "../firebase";
import requests from "./requests";
import axios from "axios";
import LoadSettingsData from "./LoadData";

export default function Settings() {
    const [pfpUrl, setPfpUrl] = useState('');
    const [isPfpUrlFocused, setIsPfpUrlFocused] = useState(false);
    const auth = getAuth();
    const languagesRequest = `https://api.themoviedb.org/3/configuration?api_key=${requests.key}&append_to_response=countries,languages`;
    const [successAlert, setSuccessAlert] = useState('');
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [locationOptions, setLocationOptions] = React.useState([]);
    const [languageOptions, setLanguageOptions] = React.useState([]);

    document.onmousedown = () => {
        return true;
    };

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user && !isPfpUrlFocused) {
                setPfpUrl(auth.currentUser.photoURL);
                loadData().then(() => {});
            }
        });
        axios.get(languagesRequest).then((response) => {
            setLanguageOptions(response?.data?.languages);
            setLocationOptions(response?.data?.countries);
            console.log(response)
        }).catch((err) => {
            console.log(err);
        });
    }, [languagesRequest, auth, isPfpUrlFocused]);

    async function loadData() {
        await LoadSettingsData();
        setIsLoading(false);
    }

    function setPfpUrlHandler(evt) {
        setPfpUrl(evt.target.value);
    }
    const setLocationHandler = (event) => {
        document.getElementById("location-select").value = "A"
        document.getElementById("root").setAttribute("locvalue", event.target.value.toString());
    };
    const setLanguageHandler = (event) => {
        document.getElementById("root").setAttribute("langvalue", event.target.value.toString());
    };

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    async function save() {
        const user = auth.currentUser.uid.toString().trim();
        const lang = document.getElementById("root")?.getAttribute('langvalue');
        const loc = document.getElementById("root")?.getAttribute('locvalue');
        await updateProfile(auth.currentUser, {
            photoURL: pfpUrl
        }).then(() => {

        }).catch((error) => {
            console.log(error);
            setError(error.message);
        })
        await setDoc(doc(db, "users", user, "settings", "Language"), {
            lang_iso: lang
        }).then(async () => {
            await setDoc(doc(db, "users", user, "settings", "Location"), {
                loc_iso: loc
            }).then(async () => {
                setSuccessAlert("Successfully Saved!");
                setOpen(true);
                await delay(5000);
                setOpen(false);
            });
        });
    }

    return (
        !isLoading && <Layout>
            <div className="settings-panel w-[75%]">
                <div className="text-left font-bold mb-2">Profile Picture URL</div>
                <input className="text_field w-full" type="text" placeholder="Photo URL" onChange={setPfpUrlHandler} value={pfpUrl} onFocus={() => {setIsPfpUrlFocused(true)}}/>
                <div className="text-left font-bold mb-2">Country</div>
                <Select className="w-full h-full text_field_border"
                        labelId="location-select-label"
                        id="location-select"
                        value={document.getElementById("root")?.getAttribute('locvalue')}
                        renderValue={() => document.getElementById("root")?.getAttribute('locvalue')}
                        onChange={setLocationHandler}
                        sx={{color: "#F09819"}}>
                    {locationOptions.map((item, id) => (
                        <MenuItem key={id} value={item?.iso_3166_1}><div className="text_field_color">{item.english_name ? item.english_name : document.getElementById("location-select")?.getAttribute('locvalue')}</div></MenuItem>
                    ))}
                </Select>
                <div className="text-left font-bold mb-2 mt-2">Language</div>
                <Select className="w-full h-full text_field_border mb-5"
                        labelId="language-select-label"
                        id="language-select"
                        value={document.getElementById("root")?.getAttribute('langvalue')}
                        renderValue={() => document.getElementById("root")?.getAttribute('langvalue')}
                        onChange={setLanguageHandler}
                        sx={{color: "#F09819"}}>
                    {languageOptions.map((item, id) => (
                        <MenuItem key={id} value={item?.iso_639_1}><div className="text_field_color">{item.english_name ? item.english_name : document.getElementById("location-select")?.getAttribute('langvalue')}</div></MenuItem>
                    ))}
                </Select>
                <button className="settings-btn button" onClick={save}>Save</button>
                {successAlert ? <Collapse in={open}><Alert className="mt-2" variant="filled" severity="success" action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setOpen(false);
                        }}>
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }>{successAlert.toString()}</Alert></Collapse> : null}
                {error ? <Alert className="mt-2" variant="filled" severity="error">{error.toString()}</Alert> : null}
            </div>
        </Layout>
    )
}