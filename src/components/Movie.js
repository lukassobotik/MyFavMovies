import Layout from "./Layout";
import {useEffect, useState} from "react";
import requests from "./requests";
import axios from "axios";
import {useHistory} from "react-router-dom";

let loaded = false;
export default function Movie() {
    const movieId = window.location.hash.slice(8, 15);
    const movieRequest = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${requests.key}&language=en-US&append_to_response=videos,images,alternative_titles,watch/providers`;
    const [item, setItem] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    document.onmousedown = () => {
        return true;
    };

    useEffect(() => {
        if (!loaded) {
            axios.get(movieRequest).then((response) => {
                console.log(response.data);
                setItem(response.data);
            })
            setIsLoading(false);
            loaded = true;
        }
    });

    useHistory().listen(() => {
        loaded = false;
    })

    return (
        !isLoading && <Layout>
            <div className="flex h-fit text-xs sm:text-xs md:text-2xl lg:text-4xl">
                <div className="w-full h-fit mt-10 border-b-2 border-t-2 border-[#FFFFFF] justify-center overflow-hidden">
                    <div className="flex w-fit ml-[15%] mr-[15%] mt-5 mb-5 justify-center">
                        <div className="m-5 rounded-3xl"><img src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`} alt={"poster"} className="rounded-3xl w-[300px] max-w-[none]"/></div>
                        <div className="inline-block">
                            <div className="ml-5 mt-6 text-left">{item.title}</div>
                            <div className="mb-5 ml-5 mr-5 text-xs sm:text-xs md:text-lg lg:text-xl text-left">{item.runtime}m</div>
                            <div className="mb-5 ml-5 mr-5 text-xs sm:text-xs md:text-xl lg:text-2xl text-left">{item.overview}</div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}