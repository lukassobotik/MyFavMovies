import Layout from "./Layout";
import {useParams} from "react-router-dom";

export default function MovieReleases() {
    let { movieId } = useParams();

    return <Layout>
        <h1>Releases for {movieId}</h1>
    </Layout>
}