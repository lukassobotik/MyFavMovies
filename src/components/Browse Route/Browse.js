import Layout from "../Layout";
import requests from "../../Constants";
import Row from "./Row";
import {useEffect} from "react";
import {auth} from "../../firebase";
import LoadSettingsData, {LoadRatings} from "../../LoadData";
import {useState} from "react";
import './Browse.css';

export default function Browse() {
    const [isLoading, setIsLoading] = useState(true);
    const [ratedMovies, setRatedMovies] = useState([]);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                loadData().then(() => {}).catch((err) => console.error(err));
            } else {
                setIsLoading(false);
            }
        });
    }, [isLoading]);

    async function loadData() {
        if (!hasLoaded) {
            setRatedMovies(await LoadRatings());
            setHasLoaded(true);
        }
        await LoadSettingsData();
        setIsLoading(false);
    }

    return (
        !isLoading && <Layout>
            <div className="browse_container">
                {ratedMovies[0] ? <Row rowId="1" title={`Because you liked ${ratedMovies[0].name}`} fetchURL={`https://api.themoviedb.org/3/movie/${ratedMovies[0].movieId}/similar?api_key=${requests.key}&language=${document.getElementById("root")?.getAttribute('langvalue')}&page=1`}/> : null}
                <Row rowId="2" title='Upcoming' fetchURL={requests.upcoming}/>
                {ratedMovies[1] ? <Row rowId="3" title={`Because you liked ${ratedMovies[1].name}`} fetchURL={`https://api.themoviedb.org/3/movie/${ratedMovies[1].movieId}/similar?api_key=${requests.key}&language=${document.getElementById("root")?.getAttribute('langvalue')}&page=1`}/> : null}
                <Row rowId="4" title='Now Playing' fetchURL={requests.now_playing}/>
                {ratedMovies[2] ? <Row rowId="5" title={`Because you liked ${ratedMovies[2].name}`} fetchURL={`https://api.themoviedb.org/3/movie/${ratedMovies[2].movieId}/similar?api_key=${requests.key}&language=${document.getElementById("root")?.getAttribute('langvalue')}&page=1`}/> : null}
                <Row rowId="6" title='Popular' fetchURL={requests.popular}/>
                <Row rowId="7" title='Trending this Week' fetchURL={requests.trending_this_week}/>
            </div>
        </Layout>
    );
}