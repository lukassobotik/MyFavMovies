import Navbar from "./Navbar";

export default function Layout({children}) {
    return <>
        <header>
            <div>
                <Navbar/>
            </div>
        </header>
        <section>{children}</section>
    </>
}