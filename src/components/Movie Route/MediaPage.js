import Layout from "../Layout";
import React, {useEffect, useState} from "react";
import requests from "../../Constants";
import axios from "axios";
import {Link, useHistory, useParams} from "react-router-dom";
import LoadSettingsData from "../../LoadData";
import {auth} from "../../firebase";
import personWithNoImage from "../../Icons/no-person.svg";
import justwatchIcon from "../../Icons/justwatch_icon.png";

import addToWatchlist, {
    getMovieDataFromDB,
    getWatchProviderLink,
    saveRating,
    getReleaseDateItem,
    formatNumber, getMainTrailer, formatDate
} from "../MovieActions";
import {Popover, Rating, Tooltip} from "@mui/material";
import {HiHeart, HiOutlineHeart} from "react-icons/hi";
import "./Movie.css";

export default function MediaPage() {
    let { movieId } = useParams();
    let { televisionId } = useParams();
    const isMovie = !!movieId;
    const movieRequest = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${requests.key}&language=${document.getElementById("root")?.getAttribute('langvalue')}&append_to_response=videos,images,alternative_titles,watch/providers,release_dates,credits`;
    const tvRequest = `https://api.themoviedb.org/3/tv/${televisionId}?api_key=${requests.key}&language=${document.getElementById("root")?.getAttribute('langvalue')}&append_to_response=credits,episode_groups,videos`;
    const [item, setItem] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [castTab, setCastTab] = useState(true);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [releaseDates, setReleaseDates] = useState([]);
    const [playTrailer, setPlayTrailer] = useState(false);
    const [trailerPath, setTrailerPath] = useState('');
    const [isOnWatchlist, setIsOnWatchlist] = useState(false);
    const [rating, setRating] = useState(0);
    const [isRated, setIsRated] = useState(false);
    const [playLink, setPlayLink] = useState('');
    const [ratingPopoverAnchorEl, setRatingPopoverAnchorEl] = React.useState(null);
    const isRatingPopoverOpen = Boolean(ratingPopoverAnchorEl);
    const ratingPopoverId = isRatingPopoverOpen ? 'movie-rating-popover' : undefined;

    document.onmousedown = () => {
        return true;
    };

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                setIsUserLoggedIn(true);
                await LoadSettingsData().then(() => {
                    axios.get(isMovie ? movieRequest : tvRequest).then((response) => {
                        console.log(response.data);
                        setItem(response.data);
                        setMainTrailer(response.data);
                        getMovieDataFromDB(response.data).then((r) => {
                            setIsOnWatchlist(r[0]);
                            if (r[1] === null) {
                                setRating(0);
                                setIsRated(false);
                                return;
                            }
                            setRating(r[1]); setIsRated(r[2]); }).catch((err) => console.error(err));
                        setPlayLink(getWatchProviderLink(response.data));
                    }).then(() => {
                        setIsLoading(false);
                    }).catch((err) => console.error(err))
                }).catch((err) => console.error(err))
            } else {
                setIsUserLoggedIn(false);
                axios.get(isMovie ? movieRequest : tvRequest).then((response) => {
                    console.log(response.data);
                    setItem(response.data);
                    setMainTrailer(response.data);
                    setPlayLink(getWatchProviderLink(response.data));
                }).then(() => {
                    setIsLoading(false);
                });
            }
        });
    }, [movieRequest]);

    function handleScreenResize() {
        let ratio = window.innerWidth / window.innerHeight;
        if (ratio < 1.2) {
            document.getElementById("media_overview").style.width = "90vw";
            document.getElementById("media_cast").style.width = "90vw";
            document.getElementById("media_cast").style.gridRowStart = 2;
        } else {
            document.getElementById("media_overview").style.width = "45vw";
            document.getElementById("media_cast").style.width = "45vw";
            document.getElementById("media_cast").style.gridRowStart = 1;
        }
    }

    function setReleases(location) {
        if (!isMovie) return;

        let dates = getReleaseDateItem(location, item);
        if (location === document.getElementById("root")?.getAttribute('locvalue')) setReleaseDates(dates);
        return dates;
    }

    function setMainTrailer(data) {
        setTrailerPath(getMainTrailer(data));
    }

    const handleRatingClose = () => {
        setRatingPopoverAnchorEl(null);
    };
    const ratingClick = (event) => {
        if (!isUserLoggedIn) return;

        setRatingPopoverAnchorEl(event.currentTarget);
    }
    const handleRatingChange = (event, newValue) => {
        saveRating(newValue, rating, item).then((r) => {
            handleRatingClose();
            if (r[1] === null) {
                setRating(0);
                setIsRated(false);
                return;
            }
            setRating(r[1]);
            setIsRated(r[0]);
        });
    }

    const watchlistClick = () => {
        if (!isUserLoggedIn) return;

        if (isOnWatchlist) addToWatchlist({item, isOnWatchlist}).then((r) => {
            setIsOnWatchlist(r[0]);
        });
        else addToWatchlist({item, isOnWatchlist}).then(() => {
            setIsOnWatchlist(true);
        });
    }

    function showTrailer() {
        if (playTrailer) setPlayTrailer(false);
        else setPlayTrailer(true);
    }



    function formatEpisodeAndSeasonStrings(num, type) {
        if (num !== 1) return num + type + "s";
        else return num + type;
    }

    window.addEventListener('resize', handleScreenResize);

    useHistory().listen(() => {
        window.removeEventListener('resize', handleScreenResize);
    });

    return (
        !isLoading && <Layout>
            <div id="media_trailer" className={`bg-black ${!playTrailer ? "hidden" : ""} w-screen h-screen mt-[-50px]`}>
                {playTrailer ? <div className="top-0 left-0 w-full h-full absolute overflow-hidden rounded-xl">
                    <iframe src={`https://www.youtube.com/embed/${trailerPath}?autoplay=1&autohide=1?rel=0&amp&modestbranding=1`}
                            title={item.title + " Trailer"}
                            allowFullScreen loading="lazy"
                            className="w-full h-full"></iframe>
                </div> : undefined}
            </div>
            <div className={`h-full ${!playTrailer ? "mt-[-50px]" : ""}`} onLoad={handleScreenResize}>
                <div id="movie_backdrop_ribbon" className="inline-block w-[100vw] media_parent h-fit min-h-[100vh] justify-center movie_ribbon relative" onLoad={() => setReleases(document.getElementById("root")?.getAttribute('locvalue'))}>
                    <img src={`https://image.tmdb.org/t/p/original/${item.backdrop_path}`} alt="" className="w-[100vw] h-full rounded-b-3xl img_bg"/>
                    <div id="media_overview" className="relative w-full h-full ml-[5vw] pt-[15vh] w-[45vw]">
                        <div className="flex_center w-full m-auto pr-[4vw] pl-[4vw]">
                            {item.genres?.map((item, id) => {
                                if (id < 3) return <div key={id} className="bg-[#43495C] border-[#93A0C9] border-[1.5px] rounded-full w-full m-2 pt-2 pb-2 whitespace-nowrap">{item.name}</div>;
                            })}
                        </div>
                        <a href={`${item.homepage}`} className="font-bold text-[5vh]">{isMovie ? item.title : item.name}</a>
                        {item.belongs_to_collection ? <Link to={`/collection/${item.belongs_to_collection.id}/`}><div className="font-bold italic">Part of the {item.belongs_to_collection.name}</div></Link> : null}
                        {item.tagline ? <div className="mr-5 text-center w-full text-[#878787] text-[2vh] italic">{item.tagline}</div> : null}
                        {item.runtime ? <div>{item.runtime}m</div> : null}
                        <div className="flex_center m-auto w-full mt-[5vh] font-bold whitespace-nowrap">
                            {playLink ? <Tooltip title={<img src={justwatchIcon} alt="JustWatch" className="w-[10vw]"/>} placement="top">
                                    <a href={playLink} className="bg-[#21232D] border-[#777EA3] border-[1.5px] rounded-full w-full m-2 pt-2 pb-2 cursor-pointer">Play</a></Tooltip>
                                : <div className="bg-[#21232D] border-[#777EA3] text-[#838383] border-[1.5px] rounded-full w-full m-2 pt-2 pb-2">Play</div>}
                            <div className="bg-[#21232D] border-[#777EA3] border-[1.5px] rounded-full w-full m-2 pt-2 pb-2 cursor-pointer" onClick={() => watchlistClick()}>{isOnWatchlist ? "Added to My List" : "Add to My List"}</div>
                            <div className="bg-[#21232D] border-[#777EA3] border-[1.5px] rounded-full w-full m-2 pt-2 pb-2 cursor-pointer" onClick={ratingClick}>{isRated ? "Rated " + rating : "Rate"}</div>
                            <Popover id={ratingPopoverId} open={isRatingPopoverOpen} anchorEl={ratingPopoverAnchorEl} onClose={handleRatingClose} anchorOrigin={{vertical: 'center', horizontal: 'center'}} transformOrigin={{vertical: 'center', horizontal: 'center'}}>
                                <Rating name="rating" value={rating} defaultValue={0} max={10} icon={<HiHeart/>} emptyIcon={<HiOutlineHeart/>} onChange={(event, newValue) => handleRatingChange(event, newValue)}/>
                            </Popover>
                        </div>
                        <div className="rounded-full font-bold m-2 pt-2 pb-2 mt-5 cursor-pointer w-fit ml-auto mr-auto" onClick={() => showTrailer()}>Play the Trailer</div>
                        {item.overview ? <div className="mb-5 mr-5 text-white italic mt-[2vh] overflow-y-auto">{item.overview}</div> : null}
                        {item.budget ? <div>Budget: {formatNumber(item.budget)}</div> : null}
                        {item.revenue ? <div>Revenue: {formatNumber(item.revenue)}</div> : null}
                        {item.number_of_episodes ? <div>{formatEpisodeAndSeasonStrings(item.number_of_episodes, " Episode")}</div> : null}
                        {item.number_of_seasons ? <div>{formatEpisodeAndSeasonStrings(item.number_of_seasons, " Season")}</div> : null}
                        <div>Status: {item.status}</div>
                        {item.type ? <div>Type: {item.type}</div> : null}
                        <Tooltip title={ <div className="w-[100%] text-[2vh] inline-block"><div className="font-bold w-[100%] text-[2vh]">Production Countries:</div>
                            {item.production_countries?.map((country, id) => ( <div key={id}  className="w-[100%] text-[2vh]">{country.name} ({country.iso_3166_1})</div> ))}
                            <div className="font-bold w-[100%] text-[2vh]">Production Companies:</div>
                            {item.production_companies?.map((company, id) => ( <div key={id} className="w-[100%] text-[2vh]">{company.name}</div> ))} </div>} placement="bottom">
                            <div className="mt-3 text-[#878787] text-[2vh] italic">Hover to see production info</div>
                        </Tooltip>
                        {isMovie ? <Link to={`/movie/${movieId}/releases/`}><div className="font-bold mt-3">Release Dates {document.getElementById("root")?.getAttribute('locvalue') ? "(" + document.getElementById("root")?.getAttribute('locvalue') + ")" : ""}</div></Link> : <div className="font-bold mt-3">Release Dates</div>}
                        {isMovie ? <div className="mb-5">{releaseDates[0] ? releaseDates.map((date, id) => (
                            <div key={id}>{date}</div>
                        )) : <div>No Dates Added
                            <Link to={`/movie/${movieId}/releases/`}><div className="font-bold">Release Dates (US)</div></Link>
                            {setReleases("US")?.map((date, id) => (
                                <div key={id}>{date}</div>
                            ))}
                        </div>}</div> : <div>
                            <div>First Air Date: {formatDate(item.first_air_date, "Not Added")}</div>
                            <div>Last Air Date: {formatDate(item.last_air_date, "Not Added")}</div>
                        </div>}
                    </div>
                    <div id="media_cast" className="relative w-[40vw] h-[85vh] mt-[15vh] mr-[5vw] ml-auto right-0 overflow-y-scroll rounded-2xl">
                        <div className="flex_center absolute right-0 h-[4vh] w-full">
                            <div className={`font-bold mr-5 text-[3vh] cursor-pointer ${castTab ? "" : "text-[#878787]"}`} onClick={() => setCastTab(true)}>Cast</div>
                            <div className={`font-bold text-[3vh] cursor-pointer ${!castTab ? "" : "text-[#878787]"}`} onClick={() => setCastTab(false)}>Crew</div>
                        </div>
                        {castTab ? item.credits?.cast?.map((cast, id) => (
                            <Link to={`/person/${cast.id}/`} key={id} className="mr-5 mt-[4vh] w-full whitespace-pre-wrap rounded-2xl flex overflow-y-clip relative mb-2">
                                <div className="cast_names h-full m-auto">
                                    <div className="font-bold">{cast.name}</div>
                                    <div>{cast.character}</div>
                                </div>
                                <img src={cast.profile_path ? `https://image.tmdb.org/t/p/w500/${cast.profile_path}` : personWithNoImage} alt={cast.name} className="w-[25%] rounded-2xl"/>
                            </Link>
                        )) : item.credits?.crew?.map((crew, id) => (
                            <Link to={`/person/${crew.id}/`} key={id} className="mr-5 mt-[4vh] w-full whitespace-pre-wrap rounded-2xl flex overflow-y-clip relative mb-2">
                                <div className="cast_names h-full m-auto">
                                    <div className="font-bold">{crew.name}</div>
                                    <div>{crew.job}</div>
                                </div>
                                <img src={crew.profile_path ? `https://image.tmdb.org/t/p/w500/${crew.profile_path}` : personWithNoImage} alt={crew.name} className="w-[25%] rounded-2xl"/>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
}