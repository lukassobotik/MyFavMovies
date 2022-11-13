import Layout from "./Layout";
import {useEffect, useState} from "react";
import requests from "./Constants";
import axios from "axios";
import {useHistory, useParams} from "react-router-dom";

export default function Movie() {
    let { movieId } = useParams();
    const movieRequest = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${requests.key}&language=${document.getElementById("root")?.getAttribute('langvalue')}&append_to_response=videos,images,alternative_titles,watch/providers,release_dates`;
    const [item, setItem] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    let genres = ' ';

    document.onmousedown = () => {
        return true;
    };

    useEffect(() => {
        axios.get(movieRequest).then((response) => {
            console.log(response.data);
            setItem(response.data);
            appendGenres();
        }).then(() => {
            setIsLoading(false);
        })
    }, [movieRequest]);

    function handleScreenResize() {
        let ratio = window.innerWidth / window.innerHeight;
        console.log(ratio);
        if (window.innerWidth < 1200) {
            document.getElementById("movie_ribbon_items").style.marginLeft = "0";
            document.getElementById("movie_ribbon_items").style.marginRight = "0";
        } else {
            document.getElementById("movie_ribbon_items").style.marginLeft = "15%";
            document.getElementById("movie_ribbon_items").style.marginRight = "15%";
        }

        if (ratio < 1) {
            document.getElementById("movie_ribbon_items").style.display = "inline";
            document.getElementById("movie_ribbon_poster").style.marginTop = "1.25rem";
        } else {
            document.getElementById("movie_ribbon_items").style.display = "flex";
            document.getElementById("movie_ribbon_poster").style.marginTop = "auto";
        }
    }

    function appendGenres() {
        item?.genres?.map((item, id) => {
            if (id === 0) genres = genres + item.name;
            else genres = genres + ", " + item.name;
        })
        let el = document.getElementById("movie_ribbon_genres");
        if (el !== null) el.innerText = genres;
        console.log(genres);
    }

    window.addEventListener('resize', handleScreenResize);

    useHistory().listen(() => {
        window.removeEventListener('resize', handleScreenResize);
    });

    return (
        !isLoading && <Layout>
            <div className="h-fit" onLoad={appendGenres}>
                <div className="w-full bg-black h-full mt-10 border-b-2 border-t-2 border-[#FFFFFF] justify-center overflow-scroll">
                    <div id="movie_ribbon_items" className="flex w-fit h-[60vh] ml-[15%] mr-[15%] justify-center movie_ribbon">
                        <div id="movie_ribbon_poster" className="mt-auto mb-auto ml-5 rounded-3xl"><img src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`} alt={"Poster"} className="rounded-3xl w-[35vh] max-w-[none] border-2"/></div>
                        <div id="movie_ribbon_info" className="inline-block ml-5 mt-auto mb-auto text-[3vh] text-left overflow-scroll">
                            <div className="font-bold text-[4vh]">{item.title}</div>
                            <div className="flex italic text-[2vh]">
                                <div>{item.runtime}m</div>
                                <div className="ml-2 mr-2 font-bold">·</div>
                                <div id="movie_ribbon_genres" className="flex"></div>
                            </div>
                            {item.overview ? <div><div className="mr-5 font-bold">Overview:</div>
                                <div className="mb-5 mr-5 text-[#878787] italic">{item.overview}</div></div> : null}
                            {item.tagline ? <div><div className="mr-5 font-bold">Tagline:</div>
                                <div className="mr-5 text-[#878787] italic">{item.tagline}</div></div> : null}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}