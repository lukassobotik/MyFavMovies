import {useHistory} from "react-router-dom";
import requests from "./Constants";
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
import {collection, deleteDoc, doc, getDocs, setDoc} from "firebase/firestore";
import {auth, db} from "../firebase";
import {Popover, Rating} from "@mui/material";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function BrowseMovieCard({item, index, rowId, type}) {
    const history = useHistory();
    const [backdrop, setBackdrop] = useState(item.backdrop_path);
    const [isLoading, setIsLoading] = useState(true);
    const [playTrailer, setPlayTrailer] = useState(false);
    const [isOnWatchlist, setIsOnWatchlist] = useState(false);
    const [rating, setRating] = React.useState(0);
    const [isRated, setIsRated] = useState(false);
    const [ratingPopoverAnchorEl, setRatingPopoverAnchorEl] = React.useState(null);
    const isRatingPopoverOpen = Boolean(ratingPopoverAnchorEl);
    const popoverId = isRatingPopoverOpen ? 'rating-popover' : undefined;

    useEffect(() => {
        axios.get(`https://api.themoviedb.org/3/movie/${item?.id}?api_key=${requests.key}&language=${document.getElementById("root")?.getAttribute('langvalue')}&append_to_response=videos,images`
        ).then((response) => {
            let backdrops = response.data?.images?.backdrops;
            for (let i = 0; i < backdrops.length; i++) {
                if (backdrops[i].iso_639_1 === document.getElementById("root")?.getAttribute('langvalue')){
                    setBackdrop(backdrops[i]?.file_path);
                    break;
                }
            }

            response.data?.videos?.results?.map((trailer_item) => {
                let vid_key = trailer_item?.key;
                let type = trailer_item?.type;
                if (response.data?.videos?.results?.length === 0 || trailer_item?.site !== "YouTube") {
                    return;
                }
                if (type === "Trailer") {
                    item.trailer_path = vid_key;
                } else {
                    item.trailer_path = vid_key;
                }
            })
        }).then(() => setIsLoading(false)).catch((err) => {
            console.log(err);
        })
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                const watchlistSnapshot = await getDocs(collection(db, "users", auth.currentUser.uid.toString(), "watchlist"));
                watchlistSnapshot.forEach((doc) => {
                    if (doc.data().item.id.toString() === item.id.toString()) {
                        setIsOnWatchlist(true);
                    }
                });
                const ratingSnapshot = await getDocs(collection(db, "users", auth.currentUser.uid.toString(), "ratings"));
                ratingSnapshot.forEach((doc) => {
                    if (doc.data().item.id.toString() === item.id.toString()) {
                        setRating(doc.data().rating);
                        setIsRated(true);
                    }
                });
            }
        });
    }, [item]);

    const showDetails = () => {
        document.getElementById("itemInRowId" + index + "-" + rowId).style.zIndex = "10";
        document.getElementById("card" + index + "-" + rowId).style.visibility = "visible";
        setPlayTrailer(true);
    }
    const hideDetails = () => {
        document.getElementById("itemInRowId" + index + "-" + rowId).style.zIndex = "9";
        document.getElementById("card" + index + "-" + rowId).style.visibility = "hidden";
        setPlayTrailer(false);
    }

    const generalClick = () => {
        history.push("/" + type + "/" + item?.id + "/");
    }

    const playClick = () => {

    }

    async function listClick() {
        const user = auth.currentUser.uid.toString().trim();
        if (!isOnWatchlist) {
            try {
                await setDoc(doc(db, "users", user, "watchlist", item.id.toString()), {
                    item: item,
                    movieId: item?.id,
                    name: item?.title
                });
                setIsOnWatchlist(true);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        } else {
            try {
                await deleteDoc(doc(db, "users", user, "watchlist", item.id.toString()));
                setIsOnWatchlist(false);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }
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

    const saveRating = async (newValue) => {
        const user = auth.currentUser.uid.toString().trim();
        if (rating !== null) {
            try {
                await setDoc(doc(db, "users", user, "ratings", item.id.toString()), {
                    item: item,
                    movieId: item?.id,
                    name: item?.title,
                    rating: newValue
                });
                setRating(newValue);
                setIsRated(true);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        } else {
            try {
                await deleteDoc(doc(db, "users", user, "ratings", item.id.toString()));
                setRating(newValue);
                setIsRated(false);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }
    }

    return (
        <div id={"itemId" + index + "-" + rowId} className='movie_card_item w-[300px] inline-block cursor-pointer relative p-2 group' data-index={index}>
        <div id={"itemInRowId" + index + "-" + rowId} className="row_item" style={{left: 0}} onMouseOver={showDetails} onMouseLeave={hideDetails}>
            <div id={"player" + index + "-" + rowId} className="player" onClick={generalClick}>
                {!isLoading ?
                    <img className='w-full h-auto block overflow-visible rounded'
                                   src={`https://image.tmdb.org/t/p/w500/${backdrop}`} alt={item.title}/>
                    : <SkeletonTheme baseColor="#a9b7c1" highlightColor="#5e6c77">
                    <p>
                    <Skeleton className="w-[300px] aspect-video" duration={2} />
                    </p>
                    </SkeletonTheme>}
                <div className="ml-5 mt-5 w-[0px] h-auto left-0 top-0 absolute"/>
                {playTrailer ? <div className="youtube-container rounded-t">
                    <iframe src={`https://www.youtube.com/embed/${item?.trailer_path}?autoplay=1&controls=0&autohide=1?rel=0&amp&modestbranding=1`}
                            title={item.title + " Trailer"}
                            allowFullScreen loading="lazy"></iframe>
                </div> : null}
            </div>
            <div id={"card" + index + "-" + rowId} className="movie_card_info fixed w-full left-0 bg-black invisible rounded-b whitespace-nowrap overflow-hidden">
                <div className="text-white text-xs md:text-sm font-extrabold w-full h-full overflow-hidden flex items-center justify-center text-center">
                    {item?.title}
                </div>
                <div className="flex items-center justify-center text-center">
                    <IoCaretForwardCircleOutline size={30} onClick={playClick} className="movie_card_button"/>
                    {isOnWatchlist ? <IoCheckmarkCircleOutline size={30} onClick={listClick} className="movie_card_button"/> : <IoAddCircleOutline size={30} onClick={listClick} className="movie_card_button"/>}
                    {isRated ? <div onClick={ratingClick} className="movie_card_button items-center flex justify-center"><div className="absolute text-white font-bold mb-1">{rating}</div><IoEllipseOutline size={30}/></div>
                        : <IoHeartCircleOutline size={30} onClick={ratingClick} className="movie_card_button"/>}
                    <Popover id={popoverId} open={isRatingPopoverOpen} anchorEl={ratingPopoverAnchorEl} onClose={handleRatingClose} anchorOrigin={{
                            vertical: 'center',
                            horizontal: 'center',
                        }} transformOrigin={{
                            vertical: 'center',
                            horizontal: 'center'
                    }}>
                        <Rating name="rating" value={rating} defaultValue={0} max={10} icon={<HiHeart/>} emptyIcon={<HiOutlineHeart/>} onChange={(event, newValue) => {
                                saveRating(newValue).then(() => {handleRatingClose()});
                            }}
                        />
                    </Popover>
                </div>
                <div className="flex items-center items-stretch justify-center">
                    <div className="text-white whitespace-normal w-auto mr-5 text-xs md:text-sm font-bold flex-nowrap inline-block items-center h-full text-left">{item?.release_date}</div>
                    <div className="text-green-600 whitespace-normal w-auto text-xs md:text-sm font-bold flex-nowrap inline-block items-center h-full text-left">{item?.vote_average}</div>
                </div>
            </div>
        </div>
    </div>)
}