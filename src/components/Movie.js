import Layout from "./Layout";
import {useEffect, useState} from "react";
import requests from "./Constants";
import axios from "axios";
import {useHistory, useParams} from "react-router-dom";
import LoadSettingsData from "./LoadData";
import {auth} from "../firebase";

export default function Movie() {
    let { movieId } = useParams();
    const movieRequest = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${requests.key}&language=${document.getElementById("root")?.getAttribute('langvalue')}&append_to_response=videos,images,alternative_titles,watch/providers,release_dates`;
    const [item, setItem] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [releaseDates, setReleaseDates] = useState([]);
    let genres = ' ';

    document.onmousedown = () => {
        return true;
    };

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                await LoadSettingsData().then(() => {
                    axios.get(movieRequest).then((response) => {
                        console.log(response.data);
                        setItem(response.data);
                        appendGenres();
                    }).then(() => {
                        setIsLoading(false);
                    }).catch((err) => console.log(err))
                }).catch((err) => console.log(err))
            }
        });
    }, [movieRequest]);

    function handleScreenResize() {
        let ratio = window.innerWidth / window.innerHeight;
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

    function getReleaseDateItem() {
        let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        item?.release_dates?.results.map((date) => {
            if (date.iso_3166_1.toString() === document.getElementById("root")?.getAttribute('locvalue')) {
                let dates = [];
                date.release_dates?.map((date_item) => {
                    let parsedDate = new Date(date_item?.release_date?.substring(0, (date_item?.release_date?.length - 5))).toLocaleDateString(document.getElementById("root")?.getAttribute('locvalue'), options);

                    switch (date_item.type) {
                        case 1:
                            dates.push(parsedDate + " (Premiere)");
                            break;
                        case 2:
                            dates.push(parsedDate + " (Theatrical (limited))");
                            break;
                        case 3:
                            dates.push(parsedDate + " (Theatrical)");
                            break;
                        case 4:
                            dates.push(parsedDate + " (Digital)");
                            break;
                        case 5:
                            dates.push(parsedDate + " (Physical)");
                            break;
                        case 6:
                            dates.push(parsedDate + " (TV)");
                            break;
                        default:
                            console.error("Wrong Type of Release Date");
                    }
                })
                setReleaseDates(dates);
            }
        })
    }

    function appendGenres() {
        item?.genres?.map((item, id) => {
            if (id === 0) genres = genres + item.name;
            else genres = genres + ", " + item.name;
        })
        let el = document.getElementById("movie_ribbon_genres");
        if (el !== null) el.innerText = genres;
    }

    window.addEventListener('resize', handleScreenResize);

    useHistory().listen(() => {
        window.removeEventListener('resize', handleScreenResize);
    });

    return (
        !isLoading && <Layout>
            <div className="h-fit" onLoad={appendGenres}>
                <div className="w-full bg-black h-full mt-10 border-b-2 border-t-2 border-[#FFFFFF] justify-center overflow-scroll" onLoad={handleScreenResize}>
                    <div id="movie_ribbon_items" className="flex w-fit h-[60vh] ml-[15%] mr-[15%] justify-center movie_ribbon" onLoad={getReleaseDateItem}>
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
                <div className="w-full bg-black h-full border-b-2 border-[#FFFFFF] justify-center overflow-scroll">
                    <div>{releaseDates.map((date) => (
                        <div>{date}</div>
                    ))}</div>
                </div>
            </div>
        </Layout>
    )
}