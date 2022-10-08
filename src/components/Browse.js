import Layout from "./Layout";
import requests from "./requests";
import Row from "./Row";

export default function Browse() {
    document.onmousedown = () => {
        return false;
    };
    return (
        <Layout>
            <div className="browse_container">
                <Row rowId="1" title='Now Playing' fetchURL={requests.now_playing}/>
                <Row rowId="2" title='Upcoming' fetchURL={requests.upcoming}/>
                <Row rowId="3" title='Popular' fetchURL={requests.popular}/>
                <Row rowId="4" title='Trending this Week' fetchURL={requests.trending_this_week}/>
            </div>
        </Layout>
    );
}