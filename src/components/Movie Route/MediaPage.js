import Layout from "../Layout";
import React, {useEffect, useState} from "react";
import requests, {gridScreenSizeGroups, ratioGroups} from "../../Constants";
import axios from "axios";
import {Link, useHistory, useParams} from "react-router-dom";
import LoadSettingsData from "../../LoadData";
import {auth} from "../../firebase";
import personWithNoImage from "../../Icons/no-person.svg";
import justwatchIcon from "../../Icons/justwatch_icon.png";

import {
    IoAddCircleOutline,
    IoCaretForwardCircleOutline,
    IoCheckmarkCircleOutline,
    IoClose,
    IoEllipseOutline,
    IoHeartCircleOutline
} from "react-icons/io5";
import addToWatchlist, {
    getMovieDataFromDB,
    getWatchProviderLink,
    saveRating,
    getReleaseDateItem,
    formatNumber, getMainTrailer
} from "../MovieActions";
import {Popover, Rating, Tooltip} from "@mui/material";
import {HiHeart, HiOutlineHeart} from "react-icons/hi";
import "./Movie.css";

export default function MediaPage() {
    let { movieId } = useParams();
    let { televisionId } = useParams();
    const isMovie = !!movieId;
    const movieRequest = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${requests.key}&language=${document.getElementById("root")?.getAttribute('langvalue')}&append_to_response=videos,images,alternative_titles,watch/providers,release_dates,credits`;
    const tvRequest = `https://api.themoviedb.org/3/tv/${televisionId}?api_key=${requests.key}&language=${document.getElementById("root")?.getAttribute('langvalue')}`;
    const [item, setItem] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [releaseDates, setReleaseDates] = useState([]);
    const [playTrailer, setPlayTrailer] = useState(false);
    const [trailerPath, setTrailerPath] = useState('');
    const [isOnWatchlist, setIsOnWatchlist] = useState(false);
    const [rating, setRating] = useState(0);
    const [isRated, setIsRated] = useState(false);
    const [hasAlreadyBeenLoaded, setHasBeenAlreadyLoaded] = useState(false);
    const [showCollectionPoster, setShowCollectionPoster] = useState(true);
    const [playLink, setPlayLink] = useState('');
    const [ratingPopoverAnchorEl, setRatingPopoverAnchorEl] = React.useState(null);
    const isRatingPopoverOpen = Boolean(ratingPopoverAnchorEl);
    const ratingPopoverId = isRatingPopoverOpen ? 'movie-rating-popover' : undefined;
    let genres = ' ';

    document.onmousedown = () => {
        return true;
    };

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
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
                            setRating(r[1]); setIsRated(r[2]); })

                        setPlayLink(getWatchProviderLink(response.data));
                    }).then(() => {
                        setIsLoading(false);
                    }).catch((err) => console.error(err))
                }).catch((err) => console.log(err))
            }
        });
    }, [movieRequest]);

    function handleScreenResize() {
        let ratio = window.innerWidth / window.innerHeight;
        if (ratio < 1) {
            document.getElementById("movie_ribbon_items").style.display = "inline";
            document.getElementById("movie_ribbon_poster").style.marginTop = "1.25rem";
            document.getElementById("movie_ribbon_poster").style.marginLeft = "0";
            document.getElementById("movie_ribbon_poster").style.width = "100%";
            document.getElementById("release_dates_ribbon").style.textAlign = "left";
            document.getElementById("movie_collection_link").style.fontSize = "4vh";
            document.getElementById("imdb_icon").style.width = "5vh";
            document.getElementById("imdb_icon").style.marginTop = "1.25rem";
            setShowCollectionPoster(false);
        } else {
            document.getElementById("movie_ribbon_items").style.display = "flex";
            document.getElementById("movie_ribbon_poster").style.marginTop = "auto";
            document.getElementById("movie_ribbon_poster").style.marginLeft = "1.25rem";
            document.getElementById("movie_ribbon_poster").style.width = "";
            document.getElementById("release_dates_ribbon").style.textAlign = "center";
            document.getElementById("movie_collection_link").style.fontSize = "4vw";
            document.getElementById("imdb_icon").style.width = "2vw";
            document.getElementById("imdb_icon").style.marginTop = "0";
            setShowCollectionPoster(true);
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
        if (isOnWatchlist) addToWatchlist({item, isOnWatchlist}).then((r) => {
            setIsOnWatchlist(r[0]);
        });
        else addToWatchlist({item, isOnWatchlist}).then(() => {
            setIsOnWatchlist(true);
        });
    }

    function changePlayTrailer(value) {
        if (value === true) {
            document.getElementById("movie_route_trailer").style.width = "";
            setPlayTrailer(true);
        } else if (value === false) {
            document.getElementById("movie_route_trailer").style.width = "100%";
            setPlayTrailer(false);
        } else if (value.type === "load" && !hasAlreadyBeenLoaded) {
            document.getElementById("movie_route_trailer").style.width = "100%";
            setHasBeenAlreadyLoaded(true);
        }
    }

    window.addEventListener('resize', handleScreenResize);

    useHistory().listen(() => {
        window.removeEventListener('resize', handleScreenResize);
    });

    return (
        !isLoading && <Layout>
            <div className="h-fit mt-[-50px]" onLoad={handleScreenResize}>
                <div id="movie_backdrop_ribbon" className="flex w-[100vw] h-[100vh] justify-center movie_ribbon img_bg relative" onLoad={() => setReleases(document.getElementById("root")?.getAttribute('locvalue'))}>
                    <img src={`https://image.tmdb.org/t/p/original/${item.backdrop_path}`} alt="" className="w-[100vw]"/>
                    <div className="absolute w-full h-fit">
                        <div className="relative w-full h-full ml-[5vw] mt-[15vh] w-[45vw]">
                            <div className="flex_center w-full m-auto pr-[4vw] pl-[4vw]">
                                {item.genres?.map((item, id) => {
                                    if (id < 3) return <div key={id} className="bg-[#43495C] border-[#93A0C9] border-[1.5px] rounded-full w-full m-2 pt-2 pb-2 whitespace-nowrap">{item.name}</div>;
                                })}
                            </div>
                            <a href={`${item.homepage}`} className="font-bold text-[5vh]">{item.title}</a>
                            {item.tagline ? <div className="mr-5 text-center w-full text-[#878787] text-[2vh] italic">{item.tagline}</div> : null}
                            <div>{item.runtime}m</div>
                            <div className="flex_center m-auto w-full mt-[5vh] font-bold">
                                {playLink ? <Tooltip title={<img src={justwatchIcon} alt="JustWatch" className="w-[10vw]"/>} placement="top">
                                        <a href={playLink} className="bg-[#21232D] border-[#777EA3] border-[1.5px] rounded-full w-full m-2 pt-2 pb-2 cursor-pointer">Play</a></Tooltip>
                                    : <div className="bg-[#21232D] border-[#777EA3] text-[#838383] border-[1.5px] rounded-full w-full m-2 pt-2 pb-2">Play</div>}
                                <div className="bg-[#21232D] border-[#777EA3] border-[1.5px] rounded-full w-full m-2 pt-2 pb-2 cursor-pointer" onClick={() => watchlistClick()}>{isOnWatchlist ? "Added to My List" : "Add to My List"}</div>
                                <div className="bg-[#21232D] border-[#777EA3] border-[1.5px] rounded-full w-full m-2 pt-2 pb-2 cursor-pointer" onClick={ratingClick}>{isRated ? "Rated " + rating : "Rate"}</div>
                                <Popover id={ratingPopoverId} open={isRatingPopoverOpen} anchorEl={ratingPopoverAnchorEl} onClose={handleRatingClose} anchorOrigin={{vertical: 'center', horizontal: 'center'}} transformOrigin={{vertical: 'center', horizontal: 'center'}}>
                                    <Rating name="rating" value={rating} defaultValue={0} max={10} icon={<HiHeart/>} emptyIcon={<HiOutlineHeart/>} onChange={(event, newValue) => handleRatingChange(event, newValue)}/>
                                </Popover>
                            </div>
                            {item.overview ? <div className="mb-5 mr-5 text-white italic mt-[5vh]">{item.overview}</div> : null}
                            <div>Budget: {formatNumber(item.budget)}</div>
                            <div>Revenue: {formatNumber(item.revenue)}</div>
                            <div>Status: {item.status}</div>
                            <Tooltip title={ <div className="w-[100%] text-[2vh] inline-block"><div className="font-bold w-[100%] text-[2vh]">Production Countries:</div>
                                    {item.production_countries?.map((country, id) => ( <div key={id}  className="w-[100%] text-[2vh]">{country.name} ({country.iso_3166_1})</div> ))}
                                    <div className="font-bold w-[100%] text-[2vh]">Production Companies:</div>
                                    {item.production_companies?.map((company, id) => ( <div key={id} className="w-[100%] text-[2vh]">{company.name}</div> ))} </div>} placement="bottom">
                                <div className="mt-3 text-[#878787] text-[2vh] italic">Hover to see production info</div>
                            </Tooltip>
                        </div>
                    </div>
                    <div className="absolute w-[50vw] h-[85vh] mt-[15vh] mb-[15vh] mr-[5vw] ml-auto right-0 overflow-y-scroll">

                    </div>
                </div>
                {/*<div id="release_dates_ribbon" className="w-full mt-[-5px] h-full border-b-2 border-[#FFFFFF] overflow-x-scroll p-5">*/}
                {/*    <Link to={`/movie/${movieId}/releases/`}><div className="font-bold text-[3vh]">Release Dates ({document.getElementById("root")?.getAttribute('locvalue')})</div></Link>*/}
                {/*    <div className="text-[2vh]">{releaseDates[0] ? releaseDates.map((date, id) => (*/}
                {/*        <div key={id}>{date}</div>*/}
                {/*    )) : <div className="text-[2vh]">There are no release dates added*/}
                {/*        <Link to={`/movie/${movieId}/releases/`}><div className="font-bold text-[3vh]">Release Dates (US)</div></Link>*/}
                {/*        <div className="text-[2vh]">{setReleases("US")?.map((date, id) => (*/}
                {/*            <div key={id}>{date}</div>*/}
                {/*        ))}</div>*/}
                {/*    </div>}</div>*/}
                {/*</div>*/}
                {/*<div id="cast_ribbon" className="w-full h-full inline-block whitespace-nowrap">*/}
                {/*    <div className="font-bold text-[3vh] text-left ml-5 p-2">Cast</div>*/}
                {/*    <div className="flex w-full h-full overflow-x-scroll p-5 pt-0">*/}
                {/*        {item.credits?.cast?.map((cast, id) => (*/}
                {/*            <div key={id} className="mr-5 whitespace-pre-wrap bg-black rounded-2xl overflow-y-clip relative">*/}
                {/*                <Link to={`/person/${cast.id}/`} className="w-full h-full left-0 top-0 absolute"/>*/}
                {/*                <img src={cast.profile_path ? `https://image.tmdb.org/t/p/w500/${cast.profile_path}` : personWithNoImage} alt={cast.name} className="w-full rounded-t-2xl"/>*/}
                {/*                <div className="w-[25vh] text-[2vh] cast_names h-full">*/}
                {/*                    <div className="font-bold">{cast.name}</div>*/}
                {/*                    <div>{cast.character}</div>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        ))}*/}
                {/*    </div>*/}
                {/*</div>*/}
                {/*<div id="crew_ribbon" className="w-full h-full border-b-2 border-[#FFFFFF] inline-block whitespace-nowrap">*/}
                {/*    <div className="font-bold text-[3vh] text-left ml-5 p-2">Crew</div>*/}
                {/*    <div className="flex w-full h-full overflow-x-scroll p-5 pt-0">*/}
                {/*        {item.credits?.crew?.map((crew, id) => (*/}
                {/*            <div key={id} className="mr-5 whitespace-pre-wrap bg-black rounded-2xl overflow-y-clip relative">*/}
                {/*                <Link to={`/person/${crew.id}/`} className="w-full h-full left-0 top-0 absolute"/>*/}
                {/*                <img src={crew.profile_path ? `https://image.tmdb.org/t/p/w500/${crew.profile_path}` : personWithNoImage} alt={crew.name} className="w-full rounded-t-2xl"/>*/}
                {/*                <div className="w-[25vh] text-[2vh] cast_names h-full">*/}
                {/*                    <div className="font-bold">{crew.name}</div>*/}
                {/*                    <div>{crew.job}</div>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        ))}*/}
                {/*    </div>*/}
                {/*</div>*/}
                {/*{item.belongs_to_collection ?*/}
                {/*    <div id="franchise_ribbon" className="w-full h-[50vh] flex_center border-b-2 border-[#FFFFFF] whitespace-nowrap relative">*/}
                {/*        <div className="img_bg w-full h-full">*/}
                {/*            <img src={`https://image.tmdb.org/t/p/original/${item.belongs_to_collection.backdrop_path}`} alt={""} className="w-full h-full"/>*/}
                {/*        </div>*/}
                {/*        <div className="p-5 absolute whitespace-pre-wrap w-full h-full flex_center">*/}
                {/*            {showCollectionPoster ?*/}
                {/*                <img src={`https://image.tmdb.org/t/p/original/${item.belongs_to_collection.poster_path}`} alt={""} className="h-full aspect-auto border-2 border-[#FFFFFF] rounded-3xl"/>*/}
                {/*            : null}*/}
                {/*            <Link to={`/collection/${item.belongs_to_collection.id}/`}><div id="movie_collection_link" className={`font-bold text-[4vw] ml-5`}>Belongs to the {item.belongs_to_collection.name}</div></Link>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*    : null}*/}
            </div>
        </Layout>
    )
}