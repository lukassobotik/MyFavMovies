import Navbar from "./Navbar";
import {useHistory} from "react-router-dom";

export default function Layout({children}) {
    let nav = document.querySelector(".navbar");
    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
        if (nav === null) {
            nav = document.querySelector(".navbar");
        }
        if (lastScrollY < window.scrollY) {
            nav?.classList.add("navbar--hidden");
        } else {
            nav?.classList.remove("navbar--hidden");
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