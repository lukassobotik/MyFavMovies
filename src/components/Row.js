import {useEffect, useState} from "react";
import axios from "axios";
import BrowseMovieCard from "./BrowseMovieCard";
import {MdChevronLeft, MdChevronRight} from "react-icons/md"

export default function Row({title, fetchURL, rowId}) {
    const [allMovies, setAllMovies] = useState([]);
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    let width = window.innerWidth;
    if (width > 1250) {
        width = (width / 200);
        width = width - 3;
    } else if (width < 1250 && width > 800){
        width = (width / 200);
        width = width - 2;
    } else if (width < 800 && width > 600) {
        width = (width / 200);
        width = width - 1;
    } else {
        width = (width / 200);
    }
    width = Math.floor(width);

    useEffect(() => {
        axios.get(fetchURL).then((response) => {
            setMovies(response.data.results);
            setAllMovies(response.data.results);
            console.log(response.data.results);
            setIsLoading(false);
            setMovies(response.data.results.slice(0, width));
        }).catch((err) => {
            console.log(err);
        })
    }, [fetchURL]);

    let index = 0;

    const left = () => {
        let element = document.getElementById("lastLoadedNum" + rowId);
        let lastLoadedNum = document.getElementById("lastLoadedNum" + rowId)?.getAttribute('numvalue');
        lastLoadedNum = parseInt(lastLoadedNum);

        let newMovies;
        if (lastLoadedNum - width < 0) {
            newMovies = allMovies?.slice(lastLoadedNum - width);
        } else {
            newMovies = allMovies?.slice((lastLoadedNum - width), lastLoadedNum);
        }

        lastLoadedNum = lastLoadedNum - width;

        element.setAttribute("numvalue", lastLoadedNum.toString());
        element.innerText = lastLoadedNum.toString();
        setMovies(newMovies);

        if (lastLoadedNum < 0) {
            element.setAttribute("numvalue", allMovies.length.toString());
        }
    }
    const right = () => {
        let element = document.getElementById("lastLoadedNum" + rowId);
        let lastLoadedNum = document.getElementById("lastLoadedNum" + rowId).getAttribute('numvalue');
        lastLoadedNum = parseInt(lastLoadedNum);

        let newMovies;
        if (lastLoadedNum >= allMovies.length) {
            newMovies = allMovies?.slice(0, width);
        } else {
            newMovies = allMovies?.slice(lastLoadedNum, (lastLoadedNum + width));
        }

        lastLoadedNum = lastLoadedNum + width;

        element.setAttribute("numvalue", lastLoadedNum.toString());
        element.innerText = lastLoadedNum.toString();
        setMovies(newMovies);

        if (lastLoadedNum >= allMovies.length) {
            element.setAttribute("numvalue", "0");
        }
    }

    return (
        !isLoading && <div className="">
            <h2 className='text-white font-bold md:text-xl p-4 text-left'> {title} </h2>
            <div id={"row:" + rowId} className="carousel_row relative flex items-center group">
                <div id={'slider' + rowId}
                     className="slider w-full h-full relative">
                    {movies?.map((item, id) => {
                        index++;
                        return (<BrowseMovieCard key={id} item={item} index={index} rowId={rowId} type={"movie"}/>)
                    })}
                </div>
                <MdChevronRight className="arrow bg-red-500 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 right-0 hidden group-hover:block" size={40} onClick={right}/>
                <MdChevronLeft className="arrow bg-red-500 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 left-0 hidden group-hover:block" size={40} onClick={left}/>
            </div>
            <div id={"lastLoadedNum" + rowId} className="hidden" numvalue={0}></div>
        </div>
    )
}