import Layout from "./Layout";
import {Link, useHistory, useParams} from "react-router-dom";
import requests from "../Constants";
import React, {useEffect, useState} from "react";
import {auth} from "../firebase";
import LoadSettingsData from "../LoadData";
import axios from "axios";
import imdbIcon from "../Icons/imdb_favicon.png";
import instagramIcon from "../Icons/instagram_favicon.png";
import twitterIcon from "../Icons/twitter_favicon.png";
import noImage from "../Icons/no-image.png";
import personWithNoImage from "../Icons/no-person.svg";

export default function PersonPage() {
    let { personId } = useParams();
    const personRequest = `https://api.themoviedb.org/3/person/${personId}?api_key=${requests.key}&language=${document.getElementById("root")?.getAttribute('langvalue')}&append_to_response=combined_credits,external_ids`;
    const [item, setItem] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    document.onmousedown = () => {
        return true;
    };

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                await LoadSettingsData().then(() => {
                    axios.get(personRequest).then((response) => {
                        console.log(response.data);
                        setItem(response.data);
                    }).then(() => {
                        setIsLoading(false);
                    }).catch((err) => console.log(err))
                }).catch((err) => console.log(err))
            }
        });
    }, [personRequest]);

    function handleScreenResize() {
        let ratio = window.innerWidth / window.innerHeight;
        if (ratio < 1) {
            document.getElementById("person_ribbon_general_overview").style.display = "inline";
            document.getElementById("person_ribbon_pfp").style.marginTop = "1.25rem";
            document.getElementById("person_ribbon_pfp").style.marginLeft = "0";
            document.getElementById("person_ribbon_pfp").style.width = "100%";
            document.getElementById("imdb_icon").style.width = "5vh";
            document.getElementById("imdb_icon").style.marginTop = "1.25rem";
            document.getElementById("instagram_icon").style.width = "5vh";
            document.getElementById("instagram_icon").style.marginTop = "1.25rem";
            document.getElementById("twitter_icon").style.width = "5vh";
            document.getElementById("twitter_icon").style.marginTop = "1.25rem";
        } else {
            document.getElementById("person_ribbon_general_overview").style.display = "flex";
            document.getElementById("person_ribbon_pfp").style.marginTop = "auto";
            document.getElementById("person_ribbon_pfp").style.marginLeft = "1.25rem";
            document.getElementById("person_ribbon_pfp").style.width = "";
            document.getElementById("imdb_icon").style.width = "2vw";
            document.getElementById("imdb_icon").style.marginTop = "0";
            document.getElementById("instagram_icon").style.width = "2vw";
            document.getElementById("instagram_icon").style.marginTop = "0";
            document.getElementById("twitter_icon").style.width = "2vw";
            document.getElementById("twitter_icon").style.marginTop = "0";
        }
        console.log(ratio);

        if (ratio < 0.68) {
            document.getElementById("person_credits").style.padding = "0";
            document.querySelectorAll(".person_credit_release_date").forEach(el => el.style.width = "100%");
            document.querySelectorAll(".person_credit_title").forEach(el => el.style.width = "100%");
            document.querySelectorAll(".person_credits_text").forEach(el => el.style.display = "inline-block");
        } else {
            document.getElementById("person_credits").style.padding = "1.25rem";
            document.querySelectorAll(".person_credit_release_date").forEach(el => el.style.width = "40%");
            document.querySelectorAll(".person_credit_title").forEach(el => el.style.width = "60%");
            document.querySelectorAll(".person_credits_text").forEach(el => el.style.display = "flex");
        }

        const biography = document.getElementById("person_biography");
        if (biography.scrollHeight > biography.clientHeight) {
            document.getElementById("biography_scroll_indicator").style.opacity = "1";
        } else {
            document.getElementById("biography_scroll_indicator").style.opacity = "0";
        }
    }

    window.addEventListener('resize', handleScreenResize);

    useHistory().listen(() => {
        window.removeEventListener('resize', handleScreenResize);
    });

    function setBiographyScroll(e) {
        const el = e.target;
        const scrollPos = el.scrollTop + el.clientHeight
        if (scrollPos > el.clientHeight) {
            document.getElementById("biography_scroll_indicator").style.opacity = "0";
        } else {
            document.getElementById("biography_scroll_indicator").style.opacity = "1";
        }
    }

    function isMovie(media) {
        return media.media_type === "movie";
    }

    function parseDateToString(date) {
        if (date === "") return "TBD";
        let loc = document.getElementById("root")?.getAttribute('locvalue');
        let options = {year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(loc ? loc : "US", options);
    }

    function sortByDate(array) {
        array.sort(function(a,b){
            let valA = isMovie(a) ? a.release_date : a.first_air_date;
            let valB = isMovie(b) ? b.release_date : b.first_air_date;

            if (valB === "") return new Date() - new Date(valA);

            return new Date(valB)
                - new Date(valA);
        });
        return array;
    }

    return (
        !isLoading && <Layout>
            <div className="w-full h-full mt-10 justify-center border-b-2 border-white pb-5" onLoad={handleScreenResize}>
                <div id="person_ribbon_general_overview" className="flex w-fit h-fit justify-center movie_ribbon">
                    <div id="person_ribbon_pfp" className="ml-5 mt-auto relative flex_center mb-auto rounded-3xl cursor-pointer">
                        <img src={item.profile_path ? `https://image.tmdb.org/t/p/w500/${item.profile_path}` : personWithNoImage} alt={"Person Profile"} className="rounded-3xl relative w-[35vh] max-w-[none] border-2"/>
                    </div>
                    <div id="person_ribbon_info" className="inline-block ml-5 mt-auto mb-auto text-[3vh] text-left">
                        <div className="flex">
                            {item.imdb_id ?
                                <a href={"https://www.imdb.com/name/" + item.imdb_id + "/"}><img id="imdb_icon" src={imdbIcon} alt="IMDb" className="w-[2vw]"/></a>
                                : null}
                            {item.external_ids.instagram_id ?
                                <a href={"https://www.instagram.com/" + item.external_ids.instagram_id + "/"}><img id="instagram_icon" src={instagramIcon} alt="Instagram" className="w-[2vw] ml-2"/></a>
                                : null}
                            {item.external_ids.twitter_id ?
                                <a href={"https://twitter.com/" + item.external_ids.twitter_id}><img id="twitter_icon" src={twitterIcon} alt="Twitter" className="w-[2vw] ml-2"/></a>
                                : null}
                        </div>
                        <div className="font-bold text-[4vh]">{item.name}</div>
                        <div className="italic text-[2vh]">
                            <div id="movie_ribbon_genres" className="flex">Known for: {item.known_for_department}</div>
                            <div id="movie_ribbon_genres" className="flex">Birthday: {item.birthday}</div>
                            {item.deathday ? <div id="movie_ribbon_genres" className="flex">Day of Death: {item.deathday}</div> : null}
                            <div id="movie_ribbon_genres" className="flex">Place of Birth: {item.place_of_birth}</div>
                        </div>
                        <div className="relative">
                            {item.biography ? <div id="person_biography" className="overflow-auto" onScroll={setBiographyScroll}><div className="mr-5 font-bold">Biography:</div>
                                <div className="mb-5 mr-5 text-[#878787] italic h-[25vh]">{item.biography}</div></div> : null}
                            <div id="biography_scroll_indicator" className="absolute w-full italic flex_center text-[2vh] bottom-0 scroll_indicator">Scroll for more</div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="person_credits" className="p-5">
                <div className="overflow-hidden inline-block w-full">
                    <div className="font-bold text-[3vh] w-full text-left">Cast Credits: </div>
                    {sortByDate(item.combined_credits.cast).map((media, id) => (
                        <div key={id} className="w-full h-fit relative flex border-b-2 border-black person_credits">
                            <img src={media.poster_path ? `https://image.tmdb.org/t/p/w500/${media.poster_path}` : noImage} alt={""} className="h-[7vh] aspect-auto credit_poster"/>
                            <div className="flex person_credits_text w-full whitespace-normal">
                                <div className="w-[60%] inline-block ml-5 text-left flex items-center h-fit person_credit_title">
                                    <Link to={isMovie(media) ? `/movie/${media.id}/` : `/tv/${media.id}/`}><div className="text-[2vh]">{isMovie(media) ? media.title : media.name}{media.character ? " - as" : ""} {media.character}</div></Link>
                                </div>
                                <div className="italic text-[2vh] w-[40%] text-right right-0 relative person_credit_release_date">{isMovie(media) ? parseDateToString(media.release_date) : parseDateToString(media.first_air_date)}</div>
                            </div>
                        </div>
                        ))}
                </div>
            </div>
    </Layout>)
}