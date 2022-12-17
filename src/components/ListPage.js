import Layout from "./Layout";
import React, {useEffect, useState} from "react";
import {Alert, Collapse, IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {auth, db} from "../firebase";
import {collection, doc, getDocs, setDoc} from "firebase/firestore";
import {Link, useParams} from "react-router-dom";

export default function ListPage({isNew}) {
    let { nameQ } = useParams();
    const [name, setName] = useState(!isNew ? nameQ : '');
    const [description, setDescription] = useState('');
    const [backdrop, setBackdrop] = useState('');
    const [error, setError] = useState('');
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [success, setSuccess] = useState('');
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                setIsUserLoggedIn(true);

                let list = [];
                const listSnapshot = await getDocs(collection(db, "users", auth.currentUser.uid.toString(), "lists"));
                listSnapshot.forEach((doc) => {
                    if (doc.data().name === nameQ) {
                        list.push(doc.data());
                        setDescription(doc.data().description);
                        setBackdrop(doc.data().backdrop);
                    }
                });
                console.log(list);
            } else {
                setIsUserLoggedIn(false);
            }
            setIsLoading(false);
        });
    }, [nameQ]);

    function setNameHandler(ev) {
        setName(ev.target.value);
    }
    function setDescriptionHandler(ev) {
        setDescription(ev.target.value);
    }
    function setBackdropHandler(ev) {
        setBackdrop(ev.target.value);
    }

    async function submit() {
        if (name === '') {
            setError("Name is Required!");
            setIsErrorOpen(true);
            return;
        }
        console.log(name, description, backdrop);

        const user = auth.currentUser.uid.toString().trim();
        try {
            await setDoc(doc(db, "users", user, "lists", name.toString()), {
                name: name,
                description: description,
                backdrop: backdrop
            });
            setSuccess(isNew ? `Successfully Created or Edited the List under the name: ${name}` : `Successfully Edited the List under the name: ${name}`);
            setIsSuccessOpen(true);
        } catch (e) {
            console.error("Error adding document: ", e);
            setError(e);
            setIsErrorOpen(true);
        }
    }

    if (!isUserLoggedIn) return <Layout><Link to="/login/"><div className="h-[100vh] font-bold text-[4vh]">Please Log in to Edit Lists</div></Link></Layout>

    return (
        !isLoading && <Layout>
            <div className="min-h-[100vh] h-fit w-[70%] ml-auto mr-auto">
                <div className="text-[4vh] text-center font-bold mb-5">{isNew ? "Create a New List" : "Edit " + name}</div>
                {error ? <Collapse in={isErrorOpen}><Alert className="mt-2" variant="filled" severity="error" action={<IconButton size="small" onClick={() => setIsErrorOpen(false)}><CloseIcon fontSize="inherit"/></IconButton>}>{error.toString()}</Alert></Collapse> : null}
                {success ? <Collapse in={isSuccessOpen}><Alert className="mt-2" variant="filled" severity="success" action={<IconButton size="small" onClick={() => setIsSuccessOpen(false)}><CloseIcon fontSize="inherit"/></IconButton>}>{success.toString()}</Alert></Collapse> : null}
                <form>
                    <div className="text-left font-bold mb-2 text-[3vh]">Name *</div>
                    <input className="text_field w-full h-[6vh]" type="text" onChange={setNameHandler} value={name} placeholder="My Awesome List"/>
                    <div className="text-left font-bold mb-2 text-[3vh]">Description</div>
                    <textarea className="text_field w-full h-[16vh]" name="list_description" cols="40" rows="5" onChange={setDescriptionHandler} value={description} placeholder="My Favorite Movies"></textarea>
                    <div className="text-left font-bold mb-2 text-[3vh]">Backdrop Link</div>
                    <input className="text_field w-full h-[6vh]" type="text" placeholder="https://example.com/" onChange={setBackdropHandler} value={backdrop}/>
                    <input className="settings-btn button cursor-pointer" type="button" value={`${isNew ? "Create My List" : "Edit My List"}`} onClick={() => submit()}/>
                </form>
            </div>
        </Layout>
    )
}