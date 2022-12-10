import Layout from "./Layout";
import {useHistory, useParams} from "react-router-dom";
import requests from "../Constants";
import React, {useEffect, useState} from "react";
import {auth} from "../firebase";
import LoadSettingsData from "../LoadData";
import axios from "axios";
import ListCard from "./ListCard";

export default function Collection() {
    let { collectionId } = useParams();
    const collectionRequest = `https://api.themoviedb.org/3/collection/${collectionId}?api_key=${requests.key}&language=${document.getElementById("root")?.getAttribute('langvalue')}`;
    const [item, setItem] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [itemPadding, setItemPadding] = useState('p-5');
    const [titleDisplay, setTitleDisplay] = useState('flex_center absolute');
    const [bgImageVisible, setBgImageVisible] = useState(true);
    const [posterSize, setPosterSize] = useState('h-full');
    const [scaleValue, setScaleValue] = useState('vw');
    const [ribbonHeight, setRibbonHeight] = useState('50vh')

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                await LoadSettingsData().then(() => {
                    axios.get(collectionRequest).then((response) => {
                        console.log(response.data);
                        setItem(response.data);
                    }).then(() => {
                        setIsLoading(false);
                    }).catch((err) => console.log(err))
                }).catch((err) => console.log(err))
            }
        });
    }, [collectionRequest]);

    function handleScreenResize() {
        const ratio = window.innerWidth / window.innerHeight;
        if (ratio < 1) {
            setItemPadding("p-0 pt-5");
            setTitleDisplay('inline_block');
            setBgImageVisible(false);
            setPosterSize('w-[50%]')
            setScaleValue('vh');
            setRibbonHeight("fit-content");
        } else {
            setItemPadding("p-5");
            setTitleDisplay('flex_center absolute');
            setBgImageVisible(true);
            setPosterSize('h-full');
            setScaleValue('vw');
            setRibbonHeight('50vh');
        }
    }

    window.addEventListener('resize', handleScreenResize);

    useHistory().listen(() => {
        window.removeEventListener('resize', handleScreenResize);
    });

    return (
        !isLoading && <Layout>
            <div id="collection_ribbon" className={`w-full mt-5 h-[${ribbonHeight}] flex_center border-b-2 border-t-2 border-[#FFFFFF] whitespace-nowrap relative`} onLoad={handleScreenResize}>
                {bgImageVisible ? <div className="img_bg w-full h-full">
                    <img src={`https://image.tmdb.org/t/p/original/${item.backdrop_path}`} alt={""} className="w-full h-full"/>
                </div> : null}
                <div className={`p-5 whitespace-pre-wrap w-full h-full ${titleDisplay}`}>
                    <img src={`https://image.tmdb.org/t/p/original/${item.poster_path}`} alt={""} className={`${posterSize} aspect-auto border-2 border-[#FFFFFF] rounded-3xl`}/>
                    <div className="inline-block text-left">
                        <div className={`font-bold text-[4${scaleValue}] ml-5`}>{item.name}</div>
                        <div className={`text-[2${scaleValue}] ml-5`}>{item.overview}</div>
                    </div>
                </div>
            </div>
            <div className={`whitespace-nowrap ${itemPadding}`}>
                {item.parts.map((item, id) => (<ListCard key={id} item={item} deleteButton={false} showRating={false} isTV={false} isPerson={false}/>))}
            </div>
        </Layout>
    )
}