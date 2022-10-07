import {useHistory} from "react-router-dom";
import Marquee from "react-fast-marquee";

export default function Movie({item, index, rowId, type}) {
    const history = useHistory();

    const hover = () => {
        const img = document.getElementById("img" + index + "-" + rowId);
        const card = document.getElementById("card" + index + "-" + rowId);

        card.style.visibility = "visible";

        card.style.boxShadow = "10px 10px 10px black";
        img.style.boxShadow = "10px 10px 10px black";
    }
    const hide = () => {
        const img = document.getElementById("img" + index + "-" + rowId);
        const card = document.getElementById("card" + index + "-" + rowId);

        card.style.visibility = "hidden";

        card.style.boxShadow = "none";
        img.style.boxShadow = "none";
    }
    const click = () => {
        history.push("/" + type + "/" + item?.id);
    }

    return (<div id={"itemId" + index + "-" + rowId} className='w-[200px] sm:w-[240px] md:w-[280px] inline-block cursor-pointer relative p-2'>
        <div className="row_item" onMouseOver={hover} onMouseLeave={hide} onClick={click}>
            <img id={"img" + index + "-" + rowId} className='w-full h-auto block overflow-visible rounded-t'
                 src={`https://image.tmdb.org/t/p/w500/${item?.backdrop_path}`} alt={item.title}/>
            <div className='absolute top-0 left-0 w-full h-full opacity-0'>
                <p className="whitespace-normal text-xs md:text-sm font-bold flex justify-center items-center h-full text-center">{item?.title}</p>
                <div className="w-full font-bold text-center text-white">{item?.title}</div>
            </div>
            <div id={"card" + index + "-" + rowId} className="bg-black invisible rounded-b whitespace-nowrap overflow-hidden">
                <Marquee gradient={false} delay={1}>
                    <div className="text-white whitespace-nowrap text-xs md:text-sm font-extrabold  w-fit overflow-hidden flex-nowrap justify-center items-center h-full text-center">
                        {item?.title + "⠀⠀⠀⠀"}
                    </div>
                </Marquee>
                <div className="flex items-center items-stretch">
                    <div className="text-white whitespace-normal w-auto mr-5 text-xs md:text-sm font-bold flex-nowrap inline-block items-center h-full text-left">{item?.release_date}</div>
                    <div className="text-green-600 whitespace-normal w-auto text-xs md:text-sm font-bold flex-nowrap inline-block items-center h-full text-left">{item?.vote_average}</div>
                </div>
            </div>
        </div>
    </div>)
}