import {Link, useHistory} from "react-router-dom";
import requests from "../../Constants";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    IoAddCircleOutline,
    IoCaretForwardCircleOutline,
    IoCheckmarkCircleOutline,
    IoEllipseOutline,
    IoHeartCircleOutline
} from "react-icons/io5";
import {HiHeart, HiOutlineHeart} from "react-icons/hi";
import {auth} from "../../firebase";
import {Popover, Rating, Tooltip} from "@mui/material";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {
    formatDate,
    getAmountOfItemsOnScreen,
    getMovieDataFromDB,
    getWatchProviderLink,
    saveRating
} from "../MovieActions";
import emptyBackdrop from "../../Icons/empty_backdrop.png";
import './Browse.css';

export default function BrowseMovieCard({item, index, rowId, type}) {
    const request = `https://api.themoviedb.org/3/movie/${item?.id}?api_key=${requests.key}&language=${document.getElementById("root")?.getAttribute('langvalue')}&append_to_response=videos,images,watch/providers`;
    const [backdrop, setBackdrop] = useState(item?.backdrop_path);
    const [hasNoImage, setHasNoImage] = useState(false);
    const [imageWidth, setImageWidth] = useState("w500");
    const [isLoading, setIsLoading] = useState(true);
    const [playTrailer, setPlayTrailer] = useState(false);
    const [isOnWatchlist, setIsOnWatchlist] = useState(false);
    const [rating, setRating] = React.useState(0);
    const [isRated, setIsRated] = useState(false);
    const [playLink, setPlayLink] = useState('');
    const [ratingPopoverAnchorEl, setRatingPopoverAnchorEl] = React.useState(null);
    const isRatingPopoverOpen = Boolean(ratingPopoverAnchorEl);
    const popoverId = isRatingPopoverOpen ? 'browse-rating-popover' : undefined;

    useEffect(() => {
        if (item !== null) {
            handleScreenResize();
            if (item.backdrop_path === null) setHasNoImage(true);
            axios.get(request).then((response) => {
                let backdrops = response.data?.images?.backdrops;
                let userLanguage = document.getElementById("root").getAttribute('langvalue');
                if (userLanguage === null || userLanguage === undefined) userLanguage = "en";
                for (let i = 0; i < backdrops.length; i++) {
                    if (backdrops[i].iso_639_1 === userLanguage){
                        setBackdrop(backdrops[i]?.file_path);
                        break;
                    }
                }

                response.data?.videos?.results?.map((trailer_item) => {
                    if (response.data?.videos?.results?.length === 0 || trailer_item?.site !== "YouTube") {
                        return;
                    }
                    if (trailer_item?.type === "Trailer") {
                        item.trailer_path = trailer_item?.key;
                    } else {
                        item.trailer_path = trailer_item?.key;
                    }
                })

                setPlayLink(getWatchProviderLink(response.data));

            }).then(() => setIsLoading(false)).catch((err) => {
                console.log(err);
            })
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    getMovieDataFromDB(item).then((r) => { setIsOnWatchlist(r[0]); setRating(r[1]); setIsRated(r[2]); })
                }
            });
        }
    }, [item]);

    const showDetails = () => {
        document.getElementById("itemInRowId" + index + "-" + rowId).style.zIndex = "100";
        document.getElementById("card" + index + "-" + rowId).style.visibility = "visible";
        setPlayTrailer(true);
    }
    const hideDetails = () => {
        document.getElementById("itemInRowId" + index + "-" + rowId).style.zIndex = "9";
        document.getElementById("card" + index + "-" + rowId).style.visibility = "hidden";
        setPlayTrailer(false);
    }

    const ratingClick = (event) => {
        setRatingPopoverAnchorEl(event.currentTarget);
        const element = document.getElementById("itemInRowId" + index + "-" + rowId);
        element.style.transform = "scale(1.5)";
        element.style.zIndex = "10";
    }

    const handleRatingClose = () => {
        setRatingPopoverAnchorEl(null);
        hideDetails();
        const element = document.getElementById("itemInRowId" + index + "-" + rowId);
        element.style.transform = "";
        element.style.zIndex = "9";
    };

    function setLoadingSize() {
        const itemsOnScreen = getAmountOfItemsOnScreen(window.innerWidth);
        if (itemsOnScreen.at(2) === false) {
            const item = document.getElementById("slider" + rowId);
            if (item === null) return;
            item.style.marginLeft = "0";
            item.style.marginRight = "0";
            const title = document.getElementById("rowTitle" + rowId);
            if (title === null) return;
            title.style.marginLeft = "0";
        } else {
            const item = document.getElementById("slider" + rowId);
            if (item === null) return;
            item.style.marginLeft = "50px";
            item.style.marginRight = "50px";
            const title = document.getElementById("rowTitle" + rowId);
            if (title === null) return;
            title.style.marginLeft = "50px"
        }
        return itemsOnScreen.at(1);
    }

    function handleScreenResize() {
        if (window.innerWidth < 1000 && window.innerWidth > 500) {
            setImageWidth('w300')
        } else if (window.innerWidth < 500) {
            setImageWidth('w185');
        } else {
            setImageWidth('w500');
        }
    }

    window.addEventListener('resize', handleScreenResize);

    useHistory().listen(() => {
        window.removeEventListener('resize', handleScreenResize);
    });

    return (
        <div id={"itemId" + index + "-" + rowId} className={`movie_card_item w-[${setLoadingSize()}] inline-block cursor-pointer relative p-2 group`} data-index={index}>
        <div id={"itemInRowId" + index + "-" + rowId} className="row_item" style={{left: 0}} onMouseOver={showDetails} onMouseLeave={hideDetails}>
            <Link to={`/${type}/${item?.id}/`} id={"player" + index + "-" + rowId} className="player">
                {!isLoading ?
                    <div className="relative">
                        <img id={"img" + index + "-" + rowId} className='w-full h-auto block overflow-visible rounded bg-black' src={!hasNoImage ? `https://image.tmdb.org/t/p/${imageWidth}/${backdrop ? backdrop : item.backdrop_path}` : emptyBackdrop} alt={item.title} onError={() => setHasNoImage(true)}/>
                        <div className={`absolute ${!hasNoImage ? "opacity-0" : "opacity-100"} flex_center whitespace-pre-wrap font-bold text-[2vh] top-0 w-full h-full rounded`}>{item.title}</div>
                    </div>
                    : <SkeletonTheme baseColor="#a9b7c1" highlightColor="#5e6c77" className="movie_card_item">
                    <p id={"browse_movie_card_skeleton" + index + "-" + rowId}><Skeleton className="w-full aspect-video" duration={2} /></p>
                    </SkeletonTheme>}
                <div className="w-full h-full left-0 top-0"/>
                {playTrailer && !isLoading ? <div className="youtube-container rounded-t">
                    <div className="w-full h-[15%] movie_card_video_overlay absolute bottom-0"></div>
                    <iframe src={`https://www.youtube.com/embed/${item?.trailer_path}?autoplay=1&controls=0&autohide=1?rel=0&amp&modestbranding=1`}
                            title={item.title + " Trailer"}
                            allowFullScreen loading="lazy"></iframe>
                </div> : null}
            </Link>
            <div id={"card" + index + "-" + rowId} className="movie_card_info bg-[#21232D] fixed w-full left-0 bg-black invisible rounded-b whitespace-nowrap overflow-hidden">
                <div className="text-white text-xs md:text-sm font-extrabold w-full h-full overflow-hidden flex items-center justify-center text-center">
                    {item?.title}
                </div>
                <div className="flex items-center justify-center text-center">
                    {playLink ? <Tooltip title={
                            <React.Fragment>
                                <p className="text-center">Provided by:</p>
                                <div className="flex_center">
                                    <img src="https://www.themoviedb.org/assets/2/v4/logos/justwatch-c2e58adf5809b6871db650fb74b43db2b8f3637fe3709262572553fa056d8d0a.svg" alt="JustWatch" className="w-[10vw]"/>
                                </div>
                            </React.Fragment>} placement="bottom">
                            <a href={playLink}><IoCaretForwardCircleOutline size={30} className="movie_card_button"/></a>
                        </Tooltip>
                        : <IoCaretForwardCircleOutline color={"#878787"} size={30} className="movie_card_button_no_cursor"/>}
                    {isOnWatchlist ? <IoCheckmarkCircleOutline size={30} onClick={() => {
                        import("../MovieActions").then(module => {
                            module.default({item, isOnWatchlist}).then((r) => { setIsOnWatchlist(r[0]); });
                        })
                    }} className="movie_card_button"/> : <IoAddCircleOutline size={30} onClick={() => {
                        import("../MovieActions").then(module => {
                            module.default({item, isOnWatchlist}).then(() => { setIsOnWatchlist(true); });
                        })
                    }} className="movie_card_button"/>}
                    {isRated ? <div onClick={ratingClick} className="movie_card_button w-[30px] flex_center text-center relative p-0"><div className="block absolute w-fit h-fit text-center text-white font-bold center">{rating}</div><IoEllipseOutline size={30} className="overflow-visible absolute"/></div>
                        : <IoHeartCircleOutline size={30} onClick={ratingClick} className="movie_card_button"/>}
                    <Popover id={popoverId} open={isRatingPopoverOpen} anchorEl={ratingPopoverAnchorEl} onClose={() => {
                        setRatingPopoverAnchorEl(null);
                        hideDetails();
                        handleRatingClose(rowId, index);
                    }} anchorOrigin={{
                            vertical: 'center',
                            horizontal: 'center',
                        }} transformOrigin={{
                            vertical: 'center',
                            horizontal: 'center'
                    }}>
                        <Rating name="rating" value={rating} defaultValue={0} max={10} icon={<HiHeart/>} emptyIcon={<HiOutlineHeart/>} onChange={(event, newValue) => {
                                saveRating(newValue, rating, item).then((r) => {
                                    handleRatingClose();
                                    setRating(r[1]);
                                    setIsRated(r[0]);
                                });
                            }}
                        />
                    </Popover>
                </div>
                <div className="flex items-center items-stretch justify-center">
                    <div className="text-white whitespace-normal w-auto mr-5 text-xs md:text-sm font-bold flex-nowrap inline-block items-center h-full text-left">{formatDate(item?.release_date)}</div>
                    <div className="text-green-600 whitespace-normal w-auto text-xs md:text-sm font-bold flex-nowrap inline-block items-center h-full text-left">{item?.vote_average}</div>
                </div>
            </div>
        </div>
    </div>)
}