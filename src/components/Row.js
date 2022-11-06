import {useEffect, useState} from "react";
import axios from "axios";
import BrowseMovieCard from "./BrowseMovieCard";
import {MdChevronLeft, MdChevronRight} from "react-icons/md"
import {useHistory} from "react-router-dom";

const scrollAmountPerClick = 3;
const movieItemWidth = 300;

let pos = 1;
export default function Row({title, fetchURL, rowId}) {
    const [allMovies, setAllMovies] = useState([]);
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get(fetchURL).then((response) => {
            setMovies(response.data.results);
            setAllMovies(response.data.results);
            console.log(response.data.results);
            setIsLoading(false);
            // setMovies(response.data.results.slice(0, width));
        }).catch((err) => {
            console.log(err);
        })
    }, [fetchURL]);

    let index = 0;

    const setLeftOrigin = () => {
        let numvalue = parseInt(document.getElementById("slider" + rowId)?.getAttribute('numvalue'));
        let card = document.getElementById("itemInRowId" + numvalue + "-" + rowId);
        card.style.transformOrigin = "left";
    }
    const resetOrigin = (pos) => {
        for (let i = pos; i <= allMovies.length; i++) {
            let card = document.getElementById("itemInRowId" + i + "-" + rowId);
            if (card) card.style.transformOrigin = "center";
        }
    }

    const setAnimation = (direction) => {
        let elements = document.getElementById("slider" + rowId).querySelectorAll(".row_item");
        for (let i = 0; i < allMovies.length; i++) {
            let left = (parseInt(elements[i].style.left, 10));
            let width = (document.getElementById("root").scrollWidth) - (movieItemWidth * scrollAmountPerClick);
            if (direction === "right" && left > (-width)) {
                elements[i].style.left = left + (-movieItemWidth) + "px";
            } else if (direction === "left" && left < 0) {
                elements[i].style.left = left + movieItemWidth + "px";
            } else if (direction !== "left" && direction !== "right"){
                console.error("wrong direction attribute");
            }
        }
    }

    const left = () => {
        resetOrigin(pos);
        for (let i = 0; i <= scrollAmountPerClick; i++) {
            pos = parseInt(document.getElementById("slider" + rowId)?.getAttribute('numvalue'));
            let element = document.getElementById("slider" + rowId);

            if (pos - 1 > 0) pos--;

            setAnimation("left");

            element.setAttribute("numvalue", pos.toString());
        }

        setLeftOrigin();
    }
    const right = () => {
        for (let i = 0; i < scrollAmountPerClick; i++) {
            let element = document.getElementById("slider" + rowId);
            pos = parseInt(document.getElementById("slider" + rowId)?.getAttribute('numvalue'));

            if (pos + 1 < allMovies.length) pos++;

            setAnimation("right");

            element.setAttribute("numvalue", pos.toString());
        }

        setLeftOrigin();
    }

    useHistory().listen(() => {
        pos = 1;
    })

    return (
        !isLoading && <div className="">
            <h2 className='text-white font-bold md:text-xl p-4 text-left'> {title} </h2>
            <div id={"row:" + rowId} className="carousel_row relative flex whitespace-nowrap items-center group">
                <div id={'slider' + rowId}
                     className="slider w-full h-full relative"
                     numvalue={1}>
                    {movies?.map((item, id) => {
                        index++;
                        return (<BrowseMovieCard key={id} item={item} index={index} rowId={rowId} type={item.media_type ? item.media_type : "movie"}/>)
                    })}
                </div>
                <MdChevronRight className="arrow bg-red-500 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 right-0 hidden group-hover:block" size={40} onClick={right}/>
                <MdChevronLeft className="arrow bg-red-500 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 left-0 hidden group-hover:block" size={40} onClick={left}/>
            </div>
        </div>
    )
}