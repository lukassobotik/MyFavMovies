import {Link, useHistory} from "react-router-dom";
import React, {useState} from "react";
import {IoCloseCircleOutline} from "react-icons/io5";
import {deleteDoc, doc} from "firebase/firestore";
import {auth, db} from "../firebase";

export default function MovieListCard({item, deleteButton, showRating}) {
    const [showItem, setShowItem] = useState(true);
    const [scaleValue, setScaleValue] = useState('vh');
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
            setScaleValue("vw");
            setCornerRounding('2xl');
        } else {
            setScaleValue("vh");
            setCornerRounding('3xl');
        }
    }

    window.addEventListener('resize', handleScreenResize);

    useHistory().listen(() => {
        window.removeEventListener('resize', handleScreenResize);
    });

    return (
        showItem && <div className={`w-full h-[40${scaleValue}] mb-5 rounded-${cornerRounding} flex border-2 border-[#FFFFFF] bg-[#2b2b2b] overflow-hidden`} onLoad={handleScreenResize}>
            <div className="relative w-full h-full flex">
                <img className={`h-[calc(40${scaleValue} - 4px)] rounded-l-${cornerRounding} border-r-2 border-[#FFFFFF]`} src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`} alt={item?.title}/>
                <div className="relative flex w-full">
                    <div className="w-full h-full img_bg brightness-[30%]">
                        <img src={`https://image.tmdb.org/t/p/original/${item.backdrop_path}`} alt={""} className={`w-full h-full rounded-r-${cornerRounding}`}/>
                    </div>
                    <div className={`absolute overflow-y-auto overflow-x-hidden text-[3${scaleValue}] h-full`}>
                        <div className="font-extrabold m-3 w-full text-left break-words">
                            <div className={`${showRating ? "inline-block whitespace-pre-wrap" : "flex whitespace-pre-wrap"}`}>
                                <Link to={`/movie/${item.id}/`}><div className="relative">{item?.title}</div></Link>
                                {deleteButton ? <div className="w-fit h-full relative mt-auto mb-auto ml-3">
                                    <IoCloseCircleOutline className="w-fit h-fit cursor-pointer" onClick={() => {removeItem(item).then(() => {})}}/>
                                </div> : null}
                                {showRating ? <div className="w-fit relative flex_center h-fit">
                                    <div className="italic text-[#878787]">Your rating: {item?.rating}</div>
                                </div> : null}
                            </div>
                        </div>
                        <div className="inline-block w-fit h-fit whitespace-pre-wrap mr-3 ml-3 mt-[-0.75rem] text-left">{item?.overview}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}