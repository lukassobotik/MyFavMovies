import {useEffect, useState} from "react";
import axios from "axios";
import BrowseMovieCard from "./BrowseMovieCard";
import {HiChevronLeft, HiChevronRight} from "react-icons/hi"
import {screenSizeGroups} from "./Constants";

export default function Row({title, fetchURL, rowId}) {
    const [allMovies, setAllMovies] = useState([]);
    const [movies, setMovies] = useState([]);
    let scrollAmountPerClick = 3;
    let movieItemWidth = 300;
    let firstVisibleItemPosition = 0;

    useEffect(() => {
        axios.get(fetchURL).then((response) => {
            setMovies(response.data.results);
            setAllMovies(response.data.results);
            console.log(response.data.results);
        }).catch((err) => {
            console.log(err);
        })
    }, [fetchURL]);

    window.addEventListener('resize', (() => {
        let element = document.getElementById("slider" + rowId);
        movieItemWidth = document.getElementById("itemId1-" + rowId).clientWidth;
        element.style.left = (-firstVisibleItemPosition * movieItemWidth) + "px";

        setItemScaling();
    }))

    function setItemScaling() {
        if (window.innerWidth >= screenSizeGroups.sixItems) {
            document.querySelectorAll(".movie_card_item").forEach(el => el.style.width = "16.666%");
            document.getElementById("root").setAttribute("itemsonscreen", "6");
            scrollAmountPerClick = 6;
        } else if (window.innerWidth >= screenSizeGroups.fiveItems && window.innerWidth <= screenSizeGroups.sixItems) {
            document.querySelectorAll(".movie_card_item").forEach(el => el.style.width = "20%");
            document.getElementById("root").setAttribute("itemsonscreen", "5");
            scrollAmountPerClick = 5;
        } else if (window.innerWidth >= screenSizeGroups.fourItems && window.innerWidth <= screenSizeGroups.fiveItems) {
            document.querySelectorAll(".movie_card_item").forEach(el => el.style.width = "25%");
            document.getElementById("root").setAttribute("itemsonscreen", "4");
            scrollAmountPerClick = 4;
        } else if (window.innerWidth >= screenSizeGroups.threeItems && window.innerWidth <= screenSizeGroups.fourItems) {
            document.querySelectorAll(".movie_card_item").forEach(el => el.style.width = "33.333%");
            document.getElementById("root").setAttribute("itemsonscreen", "3");
            scrollAmountPerClick = 3;
        } else if (window.innerWidth >= screenSizeGroups.twoItems && window.innerWidth <= screenSizeGroups.threeItems) {
            document.querySelectorAll(".movie_card_item").forEach(el => el.style.width = "50%");
            document.getElementById("root").setAttribute("itemsonscreen", "2");
            scrollAmountPerClick = 2;
        }
        setOrigins();
    }

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
        if (direction === "right" && firstVisibleItemPosition + (scrollAmountPerClick - 1) >= allMovies.length) return;
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

        if (firstVisibleItemPosition !== (allMovies.length - (scrollAmountPerClick - 1))) return;
        if (triggerAmount === 1) {
            triggerAmount = 0;
            element.style.left = "0";
        } else triggerAmount++;
    }
    let index = 0;

    return (
        <div className="">
            <h2 className='ml-[50px] text-white font-bold md:text-xl p-4 text-left'> {title} </h2>
            <div id={"row:" + rowId} className="carousel_row relative flex whitespace-nowrap items-center group">
                <div id={'slider' + rowId}
                     className="slider ml-[50px] mr-[50px] w-full h-full relative"
                     style={{left: 0}}
                     numvalue={1}
                     onLoad={setItemScaling}>
                    {movies?.map((item, id) => {
                        index++;
                        return (<BrowseMovieCard key={id} item={item} index={index} rowId={rowId} type={item.media_type ? item.media_type : "movie"}/>)
                    })}
                </div>
                <HiChevronRight color="#FFFFFF" className="arrow w-[60px] h-full absolute opacity-100 hover:bg-opacity-50 hover:bg-[#131313] cursor-pointer z-10 right-0 hidden group-hover:block" onClick={right}/>
                <HiChevronLeft color="#FFFFFF" className="arrow w-[60px] h-full absolute opacity-100 hover:bg-opacity-50 hover:bg-[#131313] cursor-pointer z-10 left-0 hidden group-hover:block" onClick={left}/>
            </div>
        </div>
    )
}