import Navbar from "./Navbar";
import {useHistory} from "react-router-dom";
import TMDbLogo from "../Icons/themoviedb.svg"

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

    function handleScreenResize() {
        let ratio = window.innerWidth / window.innerHeight;
        if (ratio < 1) {
            document.getElementById("footer_info").style.display = "inline-block";
        } else {
            document.getElementById("footer_info").style.display = "flex";
        }
    }

    window.addEventListener('resize', handleScreenResize);
    useHistory().listen(() => {
        lastScrollY = 0;
        window.removeEventListener('resize', handleScreenResize);
    })

    return <>
        <header>
            <div>
                <Navbar/>
            </div>
        </header>
        <section className="body_section">{children}</section>
        <section className="h-[10vh]"/>
        <footer className="h-fit overflow-hidden relative">
            <div className="w-full h-[10vh] footer_transition"></div>
            <div id="footer_info" className="w-full h-[80%] footer bg-black flex items-center justify-center relative text-[2vh] p-5">
                <div className="w-full inline-block">
                    <div className="font-bold">Links:</div>
                    <div className="w-full flex_center mt-1">
                        <a href="https://github.com/PuckyEU/MyFavMovies"><img src="https://github.com/favicon.ico" alt="Github" className="footer_icon"/></a>
                        <a href="https://www.buymeacoffee.com/puckyeu" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-white.png" alt="Buy Me A Coffee" className="w-full h-[4vh] ml-1"/></a>
                    </div>
                </div>
                <div className="w-full inline-block">
                    <div className="font-bold">Support:</div>
                    <a href="https://github.com/PuckyEU/MyFavMovies/issues/new"><div>Found an Issue? Please Report it on the Github Repository.</div></a>
                    <a href="https://www.themoviedb.org/bible"><div>Found incorrect or outdated data? You're able to modify it on TMDb.</div></a>
                </div>
                <div className="w-full relative p-5 inline-block">
                    <a href="https://www.themoviedb.org/"><img src={TMDbLogo} alt="TMDb" className="w-[25%] aspect-auto ml-auto mr-auto"/></a>
                    <div className="italic">This product uses the TMDB API but is not endorsed or certified by TMDB.</div>
                </div>
            </div>
        </footer>
    </>
}