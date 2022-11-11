import Layout from "./Layout";
import {useEffect, useState} from "react";
import requests from "./Constants";
import axios from "axios";

export default function Movie() {
    const movieId = window.location.hash.slice(8, 15);
    const movieRequest = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${requests.key}&language=${document.getElementById("root")?.getAttribute('langvalue')}&append_to_response=videos,images,alternative_titles,watch/providers,release_dates`;
    const [item, setItem] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    document.onmousedown = () => {
        return true;
    };

    useEffect(() => {
        axios.get(movieRequest).then((response) => {
            console.log(response.data);
            setItem(response.data);
        })
        setIsLoading(false);
    }, [movieRequest]);

    return (
        !isLoading && <Layout>
            <div className="flex h-fit text-xs sm:text-xs md:text-2xl lg:text-4xl">
                <div className="w-full bg-black h-full mt-10 border-b-2 border-t-2 border-[#FFFFFF] justify-center">
                    <div className="flex w-fit h-[490px] ml-[15%] mr-[15%] mt-5 mb-5 justify-center">
                        <div className="m-5 rounded-3xl"><img src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`} alt={"Poster"} className="rounded-3xl w-[300px] max-w-[none] border-2"/></div>
                        <div className="inline-block ml-5 text-xs sm:text-xs md:text-xl lg:text-2xl text-left overflow-scroll">
                            <div className="mt-6 font-bold text-md sm:text-md md:text-xl lg:text-3xl">{item.title}</div>
                            <div className="flex text-xs sm:text-xs md:text-lg lg:text-xl italic mb-5">
                                <div>{item.runtime}m</div>
                                <div className="ml-2 mr-2 font-bold">·</div>
                                <div className="flex">{item?.genres?.map((item, id) => {
                                    if (id === 0) return <div key={id}>{item.name}</div>;
                                    else return <div key={id}>, {item.name}</div>;
                                })}</div>
                            </div>
                            {item.overview ? <div><div className="mr-5 font-bold">Overview:</div>
                                <div className="mb-5 mr-5 text-[#878787] italic">{item.overview}</div></div> : null}
                            {item.tagline ? <div><div className="mr-5 font-bold">Tagline:</div>
                                <div className="mb-5 mr-5 text-[#878787] italic">{item.tagline}</div></div> : null}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}