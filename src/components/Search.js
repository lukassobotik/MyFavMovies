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
                    }).catch((err) => console.log(err))
                }).catch((err) => console.log(err))
            }
        });
    }, [searchRequest]);

    function getResultType(result, id) {
        if (result.media_type === "movie") return <ListCard key={id} item={result} deleteButton={false} showRating={false} isTV={false} isPerson={false}/>;
        if (result.media_type === "tv") return <ListCard key={id} item={result} deleteButton={false} showRating={false} isTV={true} isPerson={false}/>;
        if (result.media_type === "person") return <ListCard key={id} item={result} deleteButton={false} showRating={false} isTV={false} isPerson={true}/>;
    }

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