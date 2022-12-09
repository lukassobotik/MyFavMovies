import {useEffect, useState} from "react";
import axios from "axios";
import BrowseMovieCard from "./BrowseMovieCard";
import {HiChevronLeft, HiChevronRight} from "react-icons/hi"
import {useHistory} from "react-router-dom";
import {getAmountOfItemsOnScreen} from "../MovieActions";

export default function Row({title, fetchURL, rowId}) {
    const [movies, setMovies] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    let scrollAmountPerClick = 3;
    let movieItemWidth = 300;
    let firstVisibleItemPosition = 0;
    let triggerAmountLimit = 1;

    useEffect(() => {
        axios.get(fetchURL).then((response) => {
            setMovies(response.data.results);
            setIsLoaded(true);
            console.log(response.data.results);
        }).catch((err) => {
            console.log(err);
        })
    }, [fetchURL]);

    function isTouchEnabled() {
        return ( 'ontouchstart' in window );
    }

    function handleScreenResize(ev) {
        if (ev.type !== "resize") return;

        movieItemWidth = document.getElementById("itemId1-" + rowId).clientWidth;
        document.getElementById("slider" + rowId).style.left = (-firstVisibleItemPosition * movieItemWidth) + "px";

        setItemScaling();

        if (movies.length % scrollAmountPerClick === 0) {
            triggerAmountLimit = 0;
        } else {
            triggerAmountLimit = 1;
        }
    }

    window.addEventListener('resize', handleScreenResize);

    function setItemScaling() {
        const itemsOnScreen = getAmountOfItemsOnScreen(window.innerWidth);

        document.querySelectorAll(".movie_card_item").forEach(el => el.style.width = itemsOnScreen.at(1));
        document.getElementById("root").setAttribute("itemsonscreen", itemsOnScreen.at(0).toString());
        scrollAmountPerClick = itemsOnScreen.at(0);

        if (itemsOnScreen.at(2) === false) {
            document.querySelectorAll(".movie_card_item").forEach(el => el.style.width = "50%");
            document.getElementById("root").setAttribute("itemsonscreen", "2");
            scrollAmountPerClick = 2;
            const item = document.getElementById("slider" + rowId);
            item.style.marginLeft = "0";
            item.style.marginRight = "0";
            const title = document.getElementById("rowTitle" + rowId);
            title.style.marginLeft = "0";
        } else {
            const item = document.getElementById("slider" + rowId);
            item.style.marginLeft = "50px";
            item.style.marginRight = "50px";
            const title = document.getElementById("rowTitle" + rowId);
            title.style.marginLeft = "50px"
        }

        setOrigins();
    }

    useHistory().listen(() => {
        window.removeEventListener('resize', handleScreenResize);
    });

    function setOrigins() {
        document.getElementById("slider" + rowId).querySelectorAll(".row_item").forEach(el => el.style.transformOrigin = "center");
        let index = 0;
        let rightOrigins = [];
        document.getElementById("slider" + rowId).querySelectorAll(".row_item").forEach(el => {
            if (index % scrollAmountPerClick === 0) {
                el.style.transformOrigin = "left";
                rightOrigins.push((index + scrollAmountPerClick) - 1);
            }
            rightOrigins.forEach(item => {
                if (item === index) {
                    el.style.transformOrigin = "right";
                }
            })
            index++;
        })
    }

    const setAnimation = (direction) => {
        if (direction !== "left" && direction !== "right") {
            console.error("wrong direction attribute");
            return;
        }
        let element = document.getElementById("slider" + rowId);
        movieItemWidth = document.getElementById("itemId1-1").clientWidth;

        firstVisibleItemPosition = (-parseInt(element.style.left.substring(0, element.style.left.length - 2)) / movieItemWidth) + 1;
        if (direction === "right" && firstVisibleItemPosition + (scrollAmountPerClick - 1) >= movies.length) return;
        if (direction === "left" && firstVisibleItemPosition - 1 <= 0) return;

        let left = (parseInt(element.style.left, 10));
        if (direction === "right") {
            element.style.left = left + (-movieItemWidth) + "px";
        } else if (direction === "left" && left < 0) {
            element.style.left = left + movieItemWidth + "px";
        }
    }

    let triggerAmount = 0;
    const left = () => {
        for (let i = 0; i < scrollAmountPerClick; i++) {
            setAnimation("left");
        }

        triggerAmount = 0;
    }
    const right = () => {
        let element = document.getElementById("slider" + rowId);
        for (let i = 0; i < scrollAmountPerClick; i++) {
            setAnimation("right");
        }

        if (firstVisibleItemPosition !== (movies.length - (scrollAmountPerClick - 1))) return;
        if (triggerAmount === triggerAmountLimit) {
            triggerAmount = 0;
            element.style.left = "0";
        } else triggerAmount++;
    }
    let index = 0;

    function showEmptyImages() {
        let cards = [];
        for (let i = 0; i < 20; i++) {
            cards.push(<BrowseMovieCard key={i} item={null} index={index} rowId={rowId} type={"movie"}/>);
        }
        return cards;
    }

    return (
        <div className="" onLoad={(e) => handleScreenResize({type: "resize", event: e})}>
            <h2 id={"rowTitle" + rowId} className='ml-[50px] text-white font-bold md:text-xl p-4 text-left'> {title} </h2>
            <div id={"row:" + rowId} className="carousel_row relative flex whitespace-nowrap items-center group">
                <div id={'slider' + rowId}
                     className="slider ml-[50px] mr-[50px] w-full h-full relative"
                     style={{left: 0}}
                     numvalue={1}>
                    {isLoaded ? movies?.map((item, id) => {
                        index++;
                        return (<BrowseMovieCard key={id} item={item} index={index} rowId={rowId} type={item.media_type ? item.media_type : "movie"}/>)
                    }) : showEmptyImages()}
                </div>
                <HiChevronRight color="#FFFFFF" className={`arrow w-[60px] h-full absolute opacity-100 ${isTouchEnabled() ? "block visible" : "hover:bg-opacity-50 hover:bg-[#131313] group-hover:block hidden"} cursor-pointer z-10 right-0`} onClick={right}/>
                <HiChevronLeft color="#FFFFFF" className={`arrow w-[60px] h-full absolute opacity-100 ${isTouchEnabled() ? "block visible" : "hover:bg-opacity-50 hover:bg-[#131313] group-hover:block hidden"} cursor-pointer z-10 left-0`} onClick={left}/>
            </div>
        </div>
    )
}