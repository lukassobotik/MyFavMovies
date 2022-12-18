import Layout from "./Layout";
import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {auth} from "../firebase";
import LoadSettingsData from "../LoadData";
import axios from "axios";
import requests from "../Constants";
import ListCard from "./ListCard";

export default function Search() {
    let { searchParams } = useParams();
    const searchRequest = `https://api.themoviedb.org/3/search/multi?api_key=${requests.key}&language=${document.getElementById("root")?.getAttribute('langvalue')}&query=${searchParams}&include_adult=true`;
    const [item, setItem] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                await LoadSettingsData().then(() => {
                    axios.get(searchRequest).then((response) => {
                        console.log(response.data);
                        setItem(response.data);
                    }).then(() => {
                        setIsLoading(false);
                    }).catch((err) => console.error(err))
                }).catch((err) => console.error(err))
            }
        });
    }, [searchRequest]);

    return (
        !isLoading && <Layout>
            <div className="h-fit p-5">
                {item.results.map((item, id) => (
                    getResultType(item, id)
                ))}
            </div>
        </Layout>
    )
}

export function getResultType(result, id) {
    console.log(result)
    if (result.media_type === "movie" || result.title !== undefined) return <ListCard key={id} item={result} deleteButton={false} showRating={false} isTV={false} isPerson={false} isCustom={false} editButton={false}/>;
    if (result.media_type === "tv" || result.first_air_date !== undefined) return <ListCard key={id} item={result} deleteButton={false} showRating={false} isTV={true} isPerson={false} isCustom={false} editButton={false}/>;
    if (result.media_type === "person" || result.biography !== undefined) return <ListCard key={id} item={result} deleteButton={false} showRating={false} isTV={false} isPerson={true} isCustom={false} editButton={false}/>;
}