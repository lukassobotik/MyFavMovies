
export default function Movie({item, key, index, rowId}) {

    const hover = () => {
        const img = document.getElementById("img" + index + "-" + rowId);
        const card = document.getElementById('card' + index + "-" + rowId);

        card.style.display = 'block';

        card.style.boxShadow = "10px 10px 10px black";
        img.style.boxShadow = "10px 10px 10px black";
    }
    const hide = () => {
        const img = document.getElementById("img" + index + "-" + rowId);
        const card = document.getElementById('card' + index + "-" + rowId);

        card.style.display = 'none';

        card.style.boxShadow = "none";
        img.style.boxShadow = "none";
    }

    return (<div id={"itemId" + index + "-" + rowId} className='w-[200px] sm:w-[240px] md:w-[280px] inline-block cursor-pointer relative p-2'>
            <div className="row_item" onMouseOver={hover} onMouseLeave={hide}>
                <img id={"img" + index + "-" + rowId} className='w-full h-auto block overflow-visible rounded-t'
                     src={`https://image.tmdb.org/t/p/w500/${item?.backdrop_path}`} alt={item.title}/>
                <div className='absolute top-0 left-0 w-full h-full opacity-0'>
                    <p className="whitespace-normal text-xs md:text-sm font-bold flex justify-center items-center h-full text-center">{item?.title}</p>
                    <div className="w-full font-bold text-center text-white">{item?.title}</div>
                </div>
                <div id={"card" + index + "-" + rowId} className="bg-black hidden inline-block flex rounded-b whitespace-nowrap">
                    <p className="text-white whitespace-normal text-xs md:text-sm font-extrabold inline-block flex justify-center items-center h-full text-center">{item?.title}</p>
                    <div className="text-white whitespace-normal w-auto mr-5 text-xs md:text-sm font-bold flex-auto inline-block items-center h-full text-left">{item?.release_date}</div>
                    <div className="text-green-600 whitespace-normal w-auto text-xs md:text-sm font-bold flex-auto inline-block items-center h-full text-left">{item?.vote_average}</div>
                </div>
            </div>
        </div>)
}