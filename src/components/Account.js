import Layout from "./Layout";

export default function Account() {
    document.onmousedown = () => {
        return true;
    };

    return (
        <Layout>
            <h1>Account Page</h1>
        </Layout>
    )
}