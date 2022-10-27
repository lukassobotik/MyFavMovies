import {useHistory} from "react-router-dom";
import requests from "./requests";
import {useEffect, useState} from "react";
import axios from "axios";
import {MdOutlineAddCircle, MdPlayCircle, MdStars, MdCheckCircle} from "react-icons/md"
import {setDoc, deleteDoc, doc, getDocs, collection} from "firebase/firestore";
import {auth, db} from "../firebase";

export default function BrowseMovieCard({item, index, rowId, type}) {
    const history = useHistory();
    const logoPath = `https://api.themoviedb.org/3/movie/${item?.id}/images?api_key=${requests.key}`;
    const trailerPath = `https://api.themoviedb.org/3/movie/${item?.id}/videos?api_key=${requests.key}`
    const [isLoading, setIsLoading] = useState(true);
    const [play, setPlay] = useState(false);
    const [isOnWatchlist, setIsOnWatchlist] = useState(false);
    let loaded = false;

    useEffect(() => {
        axios.get(logoPath).then((response) => {
            response.data?.backdrops.map((bg_item) => {
                let lang = bg_item?.iso_639_1;
                if (lang === "en") {
                    item.backdrop_path = bg_item.file_path;
                }
            })
            setIsLoading(false);
        }).catch((err) => {
            console.log(err);
        })
    }, [logoPath]);

    useEffect(() => {
        axios.get(trailerPath).then((response) => {
            response.data.results.map((trailer_item) => {
                let lang = trailer_item?.iso_639_1;
                let vid_key = trailer_item?.key;
                let type = trailer_item?.type;

                if (lang === "en" && type === "Trailer") {
                    item.trailer_path = vid_key;
                }
            })

        }).catch((err) => {
            console.log(err);
        })
    });

    useEffect(() => {
        if (!loaded) {
            auth.onAuthStateChanged(user => {
                if (user) {
                    loadData().then(() => {});
                }
            });
            loaded = true;
        }
    })

    useHistory().listen(() => {
        loaded = false;
    })

    async function loadData() {
        const querySnapshot = await getDocs(collection(db, "users", auth.currentUser.uid.toString(), "watchlist"));
        querySnapshot.forEach((doc) => {
            if (doc.data().item.id.toString() === item.id.toString()) {
                setIsOnWatchlist(true);
            }
        });
    }

    const hover = () => {
        const img = document.getElementById("img" + index + "-" + rowId);
        const logo = document.getElementById("logo" + index + "-" + rowId);
        const card = document.getElementById("card" + index + "-" + rowId);

        card.style.visibility = "visible";
        logo.style.width = "100px";

        setPlay(true);

        card.style.boxShadow = "10px 10px 10px black";
        img.style.boxShadow = "10px 10px 10px black";
    }
    const hide = () => {
        const img = document.getElementById("img" + index + "-" + rowId);
        const logo = document.getElementById("logo" + index + "-" + rowId);
        const card = document.getElementById("card" + index + "-" + rowId);

        card.style.visibility = "hidden";
        logo.style.width = "0px";

        setPlay(false);

        card.style.boxShadow = "none";
        img.style.boxShadow = "none";
    }
    const click = () => {
        history.push("/" + type + "/" + item?.id);
    }

    const clickPlay = () => {

    }
    async function clickList() {
        const docData = {
            item: item,
            movieId: item?.id,
            name: item?.title
        }
        const user = auth.currentUser.uid.toString().trim();
        if (!isOnWatchlist) {
            try {
                await setDoc(doc(db, "users", user, "watchlist", item.id.toString()), docData);
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
    const clickRate = () => {

    }

    return (
        !isLoading && <div id={"itemId" + index + "-" + rowId} className='w-[300px] inline-block cursor-pointer relative p-2 group' data-index={index}>
        <div id={"itemInRowId" + index + "-" + rowId} className="row_item" style={{left: 0}} onMouseOver={hover} onMouseLeave={hide}>
            <div id={"player" + index + "-" + rowId} className="" onClick={click}>
                <img id={"img" + index + "-" + rowId} className='w-full h-auto block overflow-visible rounded'
                     src={`https://image.tmdb.org/t/p/w500/${item.backdrop_path}`} alt={item.title}/>
                <img id={"logo" + index + "-" + rowId} src={`https://image.tmdb.org/t/p/w500/`} alt={""} className="ml-5 mt-5 w-[0px] h-auto left-0 top-0 absolute"/>
                {play ? <div className="youtube-container rounded-t">
                    <iframe src={`https://www.youtube.com/embed/${item?.trailer_path}?autoplay=1&controls=0&autohide=1?rel=0&amp&modestbranding=1`}
                            title={item.title + " Trailer"}
                            allowFullScreen loading="lazy"></iframe>
                </div> : null}
            </div>
            <div id={"card" + index + "-" + rowId} className="fixed w-full bg-black invisible rounded-b whitespace-nowrap overflow-hidden">
                <div className="text-white text-xs md:text-sm font-extrabold w-full h-full overflow-hidden flex items-center justify-center text-center">
                    {item?.title}
                </div>
                <div className="flex items-center justify-center text-center">
                    <MdPlayCircle size={30} onClick={clickPlay}/>
                    {isOnWatchlist ? <MdCheckCircle size={30} onClick={clickList}/> : <MdOutlineAddCircle size={30} onClick={clickList}/>}
                    <MdStars size={30} onClick={clickRate}/>
                </div>
                <div className="flex items-center items-stretch justify-center">
                    <div className="text-white whitespace-normal w-auto mr-5 text-xs md:text-sm font-bold flex-nowrap inline-block items-center h-full text-left">{item?.release_date}</div>
                    <div className="text-green-600 whitespace-normal w-auto text-xs md:text-sm font-bold flex-nowrap inline-block items-center h-full text-left">{item?.vote_average}</div>
                </div>
            </div>
        </div>
    </div>)
}