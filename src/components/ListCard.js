import {Link, useHistory} from "react-router-dom";
import React, {useState} from "react";
import {IoCloseCircleOutline} from "react-icons/io5";
import {deleteDoc, doc} from "firebase/firestore";
import {auth, db} from "../firebase";
import {formatDate} from "./MovieActions";

export default function ListCard({item, deleteButton, showRating, isTV, isPerson}) {
    const [showItem, setShowItem] = useState(true);
    const [cornerRounding, setCornerRounding] = useState('3xl');

    async function removeItem(item) {
        try {
            await deleteDoc(doc(db, "users", auth.currentUser.uid.toString(), "watchlist", item.id.toString()));
            setShowItem(false);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    function handleScreenResize() {
        const ratio = window.innerWidth / window.innerHeight;
        if (ratio < 1) {
            document.querySelectorAll(".movie_in_collection").forEach(el => el.style.height = "40vw");
            document.querySelectorAll(".movie_image_in_collection").forEach(el => el.style.height = "calc(40vw - 4px)");
            document.querySelectorAll(".movie_text_in_collection").forEach(el => el.style.fontSize = "3vw");
            setCornerRounding('2xl');
        } else {
            document.querySelectorAll(".movie_in_collection").forEach(el => el.style.height = "40vh");
            document.querySelectorAll(".movie_image_in_collection").forEach(el => el.style.height = "calc(40vh - 4px)");
            document.querySelectorAll(".movie_text_in_collection").forEach(el => el.style.fontSize = "3vh");
            setCornerRounding('3xl');
        }
    }

    window.addEventListener('resize', handleScreenResize);

    useHistory().listen(() => {
        window.removeEventListener('resize', handleScreenResize);
    });

    return (
        showItem && <div className={`w-full movie_in_collection h-[40vh] mb-5 rounded-${cornerRounding} flex border-2 border-[#FFFFFF] bg-[#2b2b2b] overflow-hidden`} onLoad={handleScreenResize}>
            <div className="relative w-full h-full flex">
                <img className={`h-[calc(40vh - 4px)] movie_image_in_collection rounded-l-${cornerRounding} border-r-2 border-[#FFFFFF]`} src={`https://image.tmdb.org/t/p/w500/${!isPerson ? item.poster_path : item.profile_path}`} alt={isTV ? item.name : item?.title}/>
                <div className="relative flex w-full">
                    <div className="w-full h-full">
                        {!isPerson ? <img src={`https://image.tmdb.org/t/p/original/${item.backdrop_path}`} alt={""} className={`w-full h-full img_bg rounded-r-${cornerRounding}`}/> : ""}
                    </div>
                    <div className={`absolute movie_text_in_collection overflow-y-auto overflow-x-hidden text-[3vh] h-full`}>
                        <div className="font-extrabold m-3 w-full text-left break-words">
                            <div className="w-fit relative flex_center h-fit">
                                <div className="italic">{formatDate(item.release_date, "")}</div>
                            </div>
                            <div className={`${showRating ? "inline-block whitespace-pre-wrap" : "flex whitespace-pre-wrap"}`}>
                                {!isTV ?
                                    !isPerson ? <Link to={`/movie/${item.id}/`}><div className="relative">{item?.title}</div></Link>
                                    : <Link to={`/person/${item.id}/`}><div className="relative">{item?.name}</div></Link>
                                 : <Link to={`/tv/${item.id}/`}><div className="relative">{item?.name}</div></Link>}
                                {deleteButton ? <div className="w-fit h-full relative mt-auto mb-auto ml-3">
                                    <IoCloseCircleOutline className="w-fit h-fit cursor-pointer" onClick={() => {removeItem(item).then(() => {})}}/>
                                </div> : null}
                                {showRating ? <div className="w-fit relative flex_center h-fit">
                                    <div className="italic text-[#878787]">Your rating: {item?.rating}</div>
                                </div> : null}
                            </div>
                        </div>
                        {!isPerson ? <div className="inline-block w-fit h-fit whitespace-pre-wrap mr-3 ml-3 mt-[-0.75rem] text-left">{item?.overview}</div>
                            : <div className="font-bold italic ml-3 inline-block w-fit h-fit whitespace-pre-wrap mr-3 ml-3 mt-[-0.75rem] text-left">Known For: {item?.known_for?.map((item, id) => (
                                <div key={id} className="font-normal">{item.media_type === "movie" ? item.title : item.name}</div>
                            ))}</div>}
                    </div>
                </div>
            </div>
        </div>
    )
}