import Layout from "./Layout";
import {useHistory, useParams} from "react-router-dom";
import requests from "../Constants";
import React, {useEffect, useState} from "react";
import {auth} from "../firebase";
import LoadSettingsData from "../LoadData";
import axios from "axios";
import ListCard from "./ListCard";

export default function CollectionPage() {
    let { collectionId } = useParams();
    const collectionRequest = `https://api.themoviedb.org/3/collection/${collectionId}?api_key=${requests.key}&language=${document.getElementById("root")?.getAttribute('langvalue')}`;
    const [item, setItem] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                await LoadSettingsData().then(() => {
                    axios.get(collectionRequest).then((response) => {
                        console.log(response.data);
                        setItem(response.data);
                    }).then(() => {
                        setIsLoading(false);
                    }).catch((err) => console.error(err))
                }).catch((err) => console.error(err))
            } else {
                axios.get(collectionRequest).then((response) => {
                    console.log(response.data);
                    setItem(response.data);
                }).then(() => {
                    setIsLoading(false);
                }).catch((err) => console.error(err))
            }
        });
    }, [collectionRequest]);

    function handleScreenResize() {
        const ratio = window.innerWidth / window.innerHeight;
        if (ratio < 1.2) {
            document.getElementById("collection_text").style.width = "100vw";
            document.getElementById("collection_items").style.width = "100vw";
            document.getElementById("collection_items").style.marginLeft = "";
            document.getElementById("collection_items").style.marginTop = "0";
            document.getElementById("collection_items").style.gridRowStart = 2;
        } else {
            document.getElementById("collection_text").style.width = "50vw";
            document.getElementById("collection_items").style.width = "50vw";
            document.getElementById("collection_items").style.marginLeft = "50vw";
            document.getElementById("collection_items").style.marginTop = "15vh";
            document.getElementById("collection_items").style.gridRowStart = 1;
        }
    }

    window.addEventListener('resize', handleScreenResize);

    useHistory().listen(() => {
        window.removeEventListener('resize', handleScreenResize);
    });

    return (
        !isLoading && <Layout>
            <div id="collection_ribbon" className={`w-full h-[fit-content] mt-[-50px] media_parent whitespace-nowrap relative`} onLoad={handleScreenResize}>
                <img src={`https://image.tmdb.org/t/p/original/${item.backdrop_path}`} alt={""} className="w-[100vw] h-full img_bg rounded-b-3xl"/>
                <div id="collection_items" className="whitespace-nowrap w-[50vw] h-[90vh] mt-[15vh] overflow-y-auto">
                    {item.parts.map((item, id) => (<ListCard key={id} item={item} deleteButton={false} showRating={false} isTV={false} isPerson={false} isCustom={false} editButton={false}/>))}
                </div>
                <div id="collection_text" className="text-left z-50 p-5 whitespace-pre-wrap w-[50vw] mt-[15vh] relative">
                    <img src={`https://image.tmdb.org/t/p/original/${item.poster_path}`} alt={""} className={`h-[50%] ml-auto mr-auto aspect-auto border-2 border-[#FFFFFF] rounded-3xl`}/>
                    <div className={`font-bold text-[4vh] ml-5`}>{item.name}</div>
                    <div className={`ml-5`}>{item.overview}</div>
                </div>
            </div>
        </Layout>
    )
}