import {useEffect, useState} from "react";
import axios from "axios";
import requests from "./requests";
import Movie from "./Movie";
import {MdChevronLeft, MdChevronRight} from "react-icons/md"

export default function Row({title, fetchURL, rowId}) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get(fetchURL).then((response) => {
            console.log(response.data.results);
            setMovies(response.data.results);
            setIsLoading(false);
        }).catch((err) => {
            console.log(err);
        })
    }, [fetchURL]);

    let index = 0;

    return (
        !isLoading && <div className="">
            <h2 className='text-white font-bold md:text-xl p-4 text-left'> {title} </h2>
            <div className="relative flex items-center group bg-gray-900">
                <div id={'slider' + rowId}
                     className="slider w-full h-full relative">
                    {movies?.map((item) => {
                        index++;
                        return (<Movie item={item} index={index} rowId={rowId} type={"movie"}/>)
                    })}
                </div>
            </div>
        </div>
    )
}