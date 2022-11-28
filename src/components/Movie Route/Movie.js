import Layout from "../Layout";
import {useEffect, useState} from "react";
import requests, {gridScreenSizeGroups, ratioGroups} from "../../Constants";
import axios from "axios";
import {Link, useHistory, useParams} from "react-router-dom";
import LoadSettingsData from "../../LoadData";
import {auth} from "../../firebase";
import personWithNoImage from "../../Icons/no-person.svg";

export default function Movie() {
    let { movieId } = useParams();
    const movieRequest = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${requests.key}&language=${document.getElementById("root")?.getAttribute('langvalue')}&append_to_response=videos,images,alternative_titles,watch/providers,release_dates,credits`;
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
            document.getElementById("movie_ribbon_poster").style.marginLeft = "0";
            document.getElementById("movie_ribbon_poster").style.width = "100%";
            document.getElementById("release_dates_ribbon").style.textAlign = "left";
        } else {
            document.getElementById("movie_ribbon_items").style.display = "flex";
            document.getElementById("movie_ribbon_poster").style.marginTop = "auto";
            document.getElementById("movie_ribbon_poster").style.marginLeft = "1.25rem";
            document.getElementById("movie_ribbon_poster").style.width = "";
            document.getElementById("release_dates_ribbon").style.textAlign = "center";
        }

        if (ratio > ratioGroups.movieCast) {
            document.querySelectorAll(".cast_names").forEach(el => el.style.width = "15vw")
        } else {
            document.querySelectorAll(".cast_names").forEach(el => el.style.width = "25vh")
        }

        if (window.innerWidth >= gridScreenSizeGroups.sixItems) {
            document.getElementById("movie_general_info_grid").style.gridTemplateColumns = "repeat(6, 1fr)";
            document.getElementById("movie_general_info_grid").style.gap = "50px";
            document.getElementById("general_info_ribbon").style.textAlign = "center";
        } else if (window.innerWidth >= gridScreenSizeGroups.threeItems && window.innerWidth < gridScreenSizeGroups.sixItems) {
            document.getElementById("movie_general_info_grid").style.gridTemplateColumns = "repeat(3, 1fr)";
            document.getElementById("movie_general_info_grid").style.gap = "50px";
            document.getElementById("general_info_ribbon").style.textAlign = "center";
        } else if (window.innerWidth >= gridScreenSizeGroups.oneItem && window.innerWidth < gridScreenSizeGroups.threeItems) {
            document.getElementById("movie_general_info_grid").style.gridTemplateColumns = "repeat(2, 1fr)";
            document.getElementById("movie_general_info_grid").style.gap = "50px";
            document.getElementById("general_info_ribbon").style.textAlign = "center";
        } else if (window.innerWidth <= gridScreenSizeGroups.oneItem) {
            document.getElementById("movie_general_info_grid").style.gridTemplateColumns = "repeat(1, 1fr)";
            document.getElementById("movie_general_info_grid").style.gap = "20px";
            document.getElementById("general_info_ribbon").style.textAlign = "left";
        }
    }

    function getReleaseDateItem(location) {
        let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let dates = [];

        const date_item = item.release_dates.results.find(date => date.iso_3166_1.toString() === location);
        date_item?.release_dates?.map((date) => {
            let parsedDate = new Date(date?.release_date?.substring(0, (date?.release_date?.length - 5))).toLocaleDateString(location, options);

            switch (date.type) {
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
        if (location === document.getElementById("root")?.getAttribute('locvalue')) setReleaseDates(dates);
        return dates;
    }

    function formatNumber(num) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        });

        if (num === 0) {
            return "Unknown";
        }

        return formatter.format(num);
    }

    function appendGenres() {
        genres = '';
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
                <div className="w-full h-full mt-10 justify-center overflow-scroll" onLoad={handleScreenResize}>
                    <div id="movie_ribbon_items" className="flex w-fit h-[60vh] ml-[15%] mr-[15%] justify-center movie_ribbon" onLoad={() => getReleaseDateItem(document.getElementById("root")?.getAttribute('locvalue'))}>
                        <div id="movie_ribbon_poster" className="ml-5 mt-auto flex_center mb-auto rounded-3xl"><img src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`} alt={"Poster"} className="rounded-3xl w-[35vh] max-w-[none] border-2"/></div>
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
                <div id="general_info_ribbon" className="w-full h-full border-b-2 border-[#FFFFFF] inline-block overflow-scroll p-5">
                    <div id="movie_general_info_grid" className="grid-container">
                        <div className="inline-block w-[100%]">
                            <div className="font-bold w-[100%] text-[2vh]">Production Companies</div>
                            <div className="w-[100%] text-[2vh] inline-block">{item.production_companies?.map((company, id) => (
                                <div key={id} className="w-[100%] inline-block">
                                    <div className="w-[100%] text-[2vh]">{company.name}</div>
                                </div>
                            ))}</div>
                        </div>
                        <div className="inline-block w-[100%]">
                            <div className="font-bold w-[100%] text-[2vh]">Production Countries</div>
                            <div className="w-[100%] text-[2vh] inline-block">{item.production_countries?.map((country, id) => (
                                <div key={id} className="w-[100%] inline-block">
                                    <div className="w-[100%] text-[2vh]">{country.name} ({country.iso_3166_1})</div>
                                </div>
                            ))}</div>
                        </div>
                        <div className="inline-block w-[100%]">
                            <div className="font-bold w-[100%] text-[2vh]">Budget</div>
                            <div className="w-[100%] text-[2vh]">{formatNumber(item.budget)}</div>
                        </div>
                        <div className="inline-block w-[100%]">
                            <div className="font-bold w-[100%] text-[2vh]">Revenue</div>
                            <div className="w-[100%] text-[2vh]">{formatNumber(item.revenue)}</div>
                        </div>
                        <div className="inline-block w-[100%]">
                            <div className="font-bold w-[100%] text-[2vh]">Spoken Languages</div>
                            <div className="w-[100%] text-[2vh] inline-block">{item.spoken_languages?.map((languages, id) => (
                                <div key={id} className="w-[100%] inline-block">
                                    <div className="w-[100%] text-[2vh]">{languages.name}</div>
                                </div>
                            ))}</div>
                        </div>
                        <div className="inline-block w-[100%]">
                            <div className="font-bold w-[100%] text-[2vh]">Status</div>
                            <div className="w-[100%] text-[2vh]">{item.status}</div>
                        </div>
                    </div>
                </div>
                <div id="release_dates_ribbon" className="w-full mt-[-5px] h-full border-b-2 border-[#FFFFFF] overflow-x-scroll p-5">
                    <Link to={`/movie/${movieId}/releases/`}><div className="font-bold text-[3vh]">Release Dates ({document.getElementById("root")?.getAttribute('locvalue')})</div></Link>
                    <div className="text-[2vh]">{releaseDates[0] ? releaseDates.map((date, id) => (
                        <div key={id}>{date}</div>
                    )) : <div className="text-[2vh]">There are no release dates added
                        <Link to={`/movie/${movieId}/releases/`}><div className="font-bold text-[3vh]">Release Dates (US)</div></Link>
                        <div className="text-[2vh]">{getReleaseDateItem("US").map((date, id) => (
                            <div key={id}>{date}</div>
                        ))}</div>
                    </div>}</div>
                </div>
                <div id="cast_ribbon" className="w-full h-full inline-block whitespace-nowrap">
                    <div className="font-bold text-[3vh] text-left ml-5 p-2">Cast</div>
                    <div className="flex w-full h-full overflow-x-scroll p-5 pt-0">
                        {item.credits?.cast?.map((cast, id) => (
                            <div key={id} className="mr-5 whitespace-pre-wrap bg-black rounded-2xl overflow-y-clip">
                                <img src={cast.profile_path ? `https://image.tmdb.org/t/p/w500/${cast.profile_path}` : personWithNoImage} alt={cast.name} className="w-full rounded-t-2xl"/>
                                <div className="w-[25vh] text-[2vh] cast_names h-full">
                                    <div className="font-bold">{cast.name}</div>
                                    <div>{cast.character}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div id="crew_ribbon" className="w-full h-full border-b-2 border-[#FFFFFF] inline-block whitespace-nowrap">
                    <div className="font-bold text-[3vh] text-left ml-5 p-2">Crew</div>
                    <div className="flex w-full h-full overflow-x-scroll p-5 pt-0">
                        {item.credits?.crew?.map((crew, id) => (
                            <div key={id} className="mr-5 whitespace-pre-wrap bg-black rounded-2xl overflow-y-clip">
                                <img src={crew.profile_path ? `https://image.tmdb.org/t/p/w500/${crew.profile_path}` : personWithNoImage} alt={crew.name} className="w-full rounded-t-2xl"/>
                                <div className="w-[25vh] text-[2vh] cast_names h-full">
                                    <div className="font-bold">{crew.name}</div>
                                    <div>{crew.job}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
}