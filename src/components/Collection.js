import Layout from "./Layout";
import {Link, useParams} from "react-router-dom";
import requests from "../Constants";
import React, {useEffect, useState} from "react";
import {auth} from "../firebase";
import LoadSettingsData from "../LoadData";
import axios from "axios";

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
                {item.parts.map((item, id) => (<div className="w-full h-[40vh] mb-5 rounded-3xl flex border-2 border-[#FFFFFF] bg-[#2b2b2b]" key={id}>
                    <div className="relative w-full h-full flex">
                        <img className="h-[calc(40vh - 4px)] rounded-l-3xl border-r-2 border-[#FFFFFF]" src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`} alt={item?.title}/>
                        <div className="relative flex w-full">
                            <div className="w-full h-full img_bg brightness-[30%]">
                                <img src={`https://image.tmdb.org/t/p/original/${item.backdrop_path}`} alt={""} className="w-full h-full rounded-r-3xl"/>
                            </div>
                            <div className="absolute overflow-y-auto overflow-x-hidden text-[3vh] h-full">
                                <div className="font-extrabold m-3 w-full text-left break-words">
                                    <div className="flex whitespace-pre-wrap">
                                        <Link to={`/movie/${item.id}/`}><div className="relative">{item?.title}</div></Link>
                                    </div>
                                </div>
                                <div className="inline-block w-fit h-fit whitespace-pre-wrap mr-3 ml-3 text-left">{item?.overview}</div>
                            </div>
                        </div>
                    </div>
                </div>))}
            </div>
        </Layout>
    )
}