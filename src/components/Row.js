import {useEffect, useState} from "react";
import axios from "axios";
import Movie from "./Movie";
import {MdChevronLeft, MdChevronRight} from "react-icons/md"
import ReactDOMServer from 'react-dom/server';

let lastLoadedNum = 0;

export default function Row({title, fetchURL, rowId}) {
    const [allMovies, setAllMovies] = useState([]);
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    let width = window.innerWidth;
    console.log(width);
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
    console.log(width);
    width = Math.floor(width);
    console.log(width);

    useEffect(() => {
        axios.get(fetchURL).then((response) => {
            console.log(response.data.results);
            setMovies(response.data.results);
            setAllMovies(response.data.results);
            setIsLoading(false);
            const newMovies = allMovies.slice(0, width);
            setMovies(newMovies);
            lastLoadedNum = width;
        }).catch((err) => {
            console.log(err);
        })
    }, [fetchURL]);

    let index = 0;

    const left = () => {
        const newMovies = allMovies.slice(lastLoadedNum, (lastLoadedNum - width));
        lastLoadedNum -= width;
        console.log(newMovies);
        console.log(movies);
        setMovies(newMovies);
    }
    const right = () => {
        const newMovies = allMovies.slice(lastLoadedNum, (lastLoadedNum + width));
        lastLoadedNum += width;
        console.log(newMovies);
        console.log(movies);
        setMovies(newMovies);
    }

    return (
        !isLoading && <div className="">
            <h2 className='text-white font-bold md:text-xl p-4 text-left'> {title} </h2>
            <div id={"row:" + rowId} className="carousel_row relative flex items-center bg-gray-900 group">
                <div id={'slider' + rowId}
                     className="slider w-full h-full relative">
                    {movies?.map((item, id) => {
                        index++;
                        return (<Movie key={id} item={item} index={index} rowId={rowId} type={"movie"}/>)
                    })}
                </div>
                <MdChevronRight className="arrow bg-red-500 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 right-0 hidden group-hover:block" size={40} onClick={right}/>
                <MdChevronLeft className="arrow bg-red-500 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 left-0 hidden group-hover:block" size={40} onClick={left}/>
            </div>
        </div>
    )
}