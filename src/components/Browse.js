import Layout from "./Layout";
import {useEffect, useState} from "react";
import axios from "axios";
import requests from "./requests";
import Row from "./Row";

export default function Browse() {
    const [genres, setGenres] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get('https://api.themoviedb.org/3/genre/movie/list?api_key=4a819538b0779358ef8be1dd6afe63a3&language=en-US').then((response) => {
            console.log(response.data.genres);
            setGenres(response.data.genres);
            setIsLoading(false);
        }).catch((err) => {
            console.log(err);
        })
    }, []);

    return (
        !isLoading && <Layout>
            <div className="container">
                <Row rowId="1" title='Latest' fetchURL={requests.latest}/>
                <Row rowId="2" title='Upcoming' fetchURL={requests.upcoming}/>
                <Row rowId="3" title='Popular' fetchURL={requests.popular}/>
            </div>

            {/*{genres.map((genre) => (*/}
            {/*    <div className="movie-row">*/}
            {/*        <div className="movie-category-label">*/}
            {/*            {genre.name}*/}
            {/*        </div>*/}
            {/*        <div className="row">*/}
            {/*            <div className="translate-row"></div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*))}*/}
        </Layout>
    );
}