import Navbar from "./Navbar";
import {useHistory} from "react-router-dom";

export default function Layout({children}) {
    let nav = document.querySelector(".navbar");
    let lastScrollY = window.scrollY;
    console.log("last scroll", lastScrollY)

    window.addEventListener("scroll", () => {
        if (nav === null) {
            nav = document.querySelector(".navbar");
        }
        if (lastScrollY < window.scrollY) {
            nav?.classList.add("navbar--hidden");
            console.log("scrolling down", lastScrollY)
        } else {
            nav?.classList.remove("navbar--hidden");
            console.log("scrolling up", lastScrollY)
        }
       lastScrollY = window.scrollY;
    });

    useHistory().listen(() => {
        lastScrollY = 0;
    })

    return <>
        <header>
            <div>
                <Navbar/>
            </div>
        </header>
        <section className="body_section">{children}</section>
        <footer className="h-[250px]">

        </footer>
    </>
}