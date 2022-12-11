import Layout from "../Layout";
import {useHistory, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {auth} from "../../firebase";
import LoadSettingsData from "../../LoadData";
import axios from "axios";
import requests from "../../Constants";
import "./Movie.css";

export default function MovieReleases() {
    let { movieId } = useParams();
    const movieRequest = `https://api.themoviedb.org/3/movie/${movieId}/release_dates?api_key=${requests.key}`;
    const [item, setItem] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    document.onmousedown = () => {
        return true;
    };

    function handleScreenResize() {
        if (window.innerWidth < 500) {
            document.getElementById("root").style.overflowX = "scroll";
            document.querySelectorAll(".release_dates_table_parent").forEach(el => el.style.display = "block");
        } else {
            document.getElementById("root").style.overflowX = "hidden";
            document.querySelectorAll(".release_dates_table_parent").forEach(el => el.style.display = "flex");
        }
    }

    window.addEventListener('resize', handleScreenResize);

    useHistory().listen(() => {
        window.removeEventListener('resize', handleScreenResize);
        document.getElementById("root").style.overflowX = "hidden";
    });

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                await LoadSettingsData().then(() => {
                    axios.get(movieRequest).then((response) => {
                        console.log(response.data);
                        setItem(response.data);
                    }).then(() => {
                        setIsLoading(false);
                    }).catch((err) => console.log(err))
                }).catch((err) => console.log(err))
            }
        });
    }, [movieRequest]);

    function parseDate(date) {
        let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date.substring(0, (date.length - 5))).toLocaleDateString(document.getElementById("root")?.getAttribute('locvalue'), options);
    }

    function getDateTypeName(type) {
        let name;
        switch (type) {
            case 1:
                name = "Premiere";
                break;
            case 2:
                name = "Theatrical (limited)";
                break;
            case 3:
                name = "Theatrical";
                break;
            case 4:
                name = "Digital";
                break;
            case 5:
                name = "Physical";
                break;
            case 6:
                name = "TV";
                break;
            default:
                console.error("Wrong Type of Release Date");
        }
        return name;
    }

    return (
        !isLoading && <Layout>
            {item.results.map((dateResult, id) => (
                <div key={id} onLoad={handleScreenResize}>
                    <div className="flex items-center justify-center font-bold text-[3vh] mt-5">{dateResult.iso_3166_1}</div>
                    <div className="flex items-center justify-center w-screen release_dates_table_parent">
                        <table id="release_dates_table">
                            <thead>
                            <tr>
                                <th>Certification</th>
                                <th>Release Date</th>
                                <th>Type</th>
                                <th>Language</th>
                                <th>Note</th>
                            </tr></thead>
                            <tbody>
                            {dateResult.release_dates.map((date, id) => (
                                <tr key={id}>
                                    <td>{date.certification}</td>
                                    <td>{parseDate(date.release_date)}</td>
                                    <td>{getDateTypeName(date.type)}</td>
                                    <td>{date.iso_639_1}</td>
                                    <td>{date.note}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </Layout>
    )
}