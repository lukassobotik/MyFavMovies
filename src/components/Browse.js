import Layout from "./Layout";
import requests from "./requests";
import Row from "./Row";
import {useEffect} from "react";
import {auth} from "../firebase";
import LoadSettingsData from "./LoadData";
import {useState} from "react";

export default function Browse() {
    const [isLoading, setIsLoading] = useState(true);

    document.onmousedown = () => {
        return false;
    };

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                loadData().then(() => {}).catch((err) => console.log(err));
            }
        });
    });

    async function loadData() {
        await LoadSettingsData();
        setIsLoading(false);
    }

    return (
        !isLoading && <Layout>
            <div className="browse_container">
                <Row rowId="1" title='Now Playing' fetchURL={requests.now_playing}/>
                <Row rowId="2" title='Upcoming' fetchURL={requests.upcoming}/>
                <Row rowId="3" title='Popular' fetchURL={requests.popular}/>
                <Row rowId="4" title='Trending this Week' fetchURL={requests.trending_this_week}/>
            </div>
        </Layout>
    );
}