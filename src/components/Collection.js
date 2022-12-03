import Layout from "./Layout";
import {useParams} from "react-router-dom";
import requests from "../Constants";
import React, {useEffect, useState} from "react";
import {auth} from "../firebase";
import LoadSettingsData from "../LoadData";
import axios from "axios";
import MovieListCard from "./MovieListCard";

export default function Collection() {
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
                        console.log(item);
                    }).catch((err) => console.log(err))
                }).catch((err) => console.log(err))
            }
        });
    }, [collectionRequest]);

    return (
        !isLoading && <Layout>
            <div id="collection_ribbon" className="w-full mt-5 h-[50vh] flex_center border-b-2 border-t-2 border-[#FFFFFF] whitespace-nowrap relative">
                <div className="img_bg w-full h-full">
                    <img src={`https://image.tmdb.org/t/p/original/${item.backdrop_path}`} alt={""} className="w-full h-full"/>
                </div>
                <div className="p-5 absolute whitespace-pre-wrap w-full h-full flex_center">
                    <img src={`https://image.tmdb.org/t/p/original/${item.poster_path}`} alt={""} className="h-full aspect-auto border-2 border-[#FFFFFF] rounded-3xl"/>
                    <div className="inline-block text-left">
                        <div className="font-bold text-[4vw] ml-5">{item.name}</div>
                        <div className="text-[2vw] ml-5">{item.overview}</div>
                    </div>
                </div>
            </div>
            <div className="whitespace-nowrap p-5">
                {item.parts.map((item, id) => (<MovieListCard key={id} item={item} deleteButton={false} showRating={false}/>))}
            </div>
        </Layout>
    )
}