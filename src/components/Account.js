import Layout from "./Layout";
import {UserAuth} from "../context/AuthContext";
import {MdPerson, MdRemoveCircle} from "react-icons/md"
import React, {useEffect, useState} from "react"
import {Box, Tab, Tabs, Typography} from "@mui/material";
import {collection, deleteDoc, doc, getDocs} from "firebase/firestore";
import {auth, db} from "../firebase";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography component={'span'}>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function Account() {
    const {user} = UserAuth();
    const [value, setValue] = React.useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [watchlist, setWatchlist] = useState([]);
    const [ratedItems, setRatedItems] = useState([]);

    document.onmousedown = () => {
        return true;
    };

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                const watchlistSnapshot = await getDocs(collection(db, "users", auth.currentUser.uid.toString(), "watchlist"));
                const watchlistItems = [];
                watchlistSnapshot.forEach((doc) => {
                    watchlistItems.push(doc.data().item);
                });
                setWatchlist(watchlistItems);
                const ratingsSnapshot = await getDocs(collection(db, "users", auth.currentUser.uid.toString(), "ratings"));
                const ratedItems = [];
                let index = 0;
                ratingsSnapshot.forEach((doc) => {
                    ratedItems.push(doc.data().item);
                    ratedItems.at(index).rating = doc.data().rating;
                    index++;
                });
                setRatedItems(ratedItems);
                setIsLoading(false);
            }
        });
        setIsLoading(false);
    }, [isLoading]);

    async function removeItem(item) {
        try {
            await deleteDoc(doc(db, "users", auth.currentUser.uid.toString(), "watchlist", item.id.toString()));
            let newWatchlist = [];
            watchlist.map((i) => {
                if (i !== item) {
                    newWatchlist.push(i);
                }
            })
            setWatchlist(newWatchlist);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    window.addEventListener('resize', (() => {
        console.log('resized to: ', window.innerWidth, 'x', window.innerHeight)
        changeMargins()
    }))

    function changeMargins() {
        if (window.innerWidth <= 750) {
            document.getElementById("account_list_panel").style.marginRight = "0";
            document.getElementById("account_list_panel").style.marginLeft = "0";
            document.getElementById("account_list_panel_box").style.width = "100vw";
        }
        if (window.innerWidth >= 750) {
            document.getElementById("account_list_panel").style.marginRight = "10%";
            document.getElementById("account_list_panel").style.marginLeft = "10%";
            document.getElementById("account_list_panel_box").style.width = "80vw";
        }
    }

    return (
        !isLoading && <Layout>
            <div className="inline-block h-screen w-full">
                <div className="h-fit w-full border-b-2 border-b-[#FFFFFF] flex justify-center items-center profile_overview text-xs sm:text-xs md:text-2xl lg:text-4xl">
                    <div className="flex justify-center w-fit">
                        <div className="h-fit aspect-square w-3/5 text-justify flex items-center justify-center rounded-full bg-gradient-to-r p-1 from-[#fe934c] to-[#fc686f]">
                            <div className="w-full h-full text-justify flex items-center justify-center rounded-full overflow-hidden">
                                {user.photoURL ? <img src={user.photoURL} alt="Invalid URl"/> :
                                    <MdPerson className="" size={500} color="#000000"/>}
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 mb-5 w-1/4">{user ? user.displayName : 'Username'}</div>
                </div>
                <div id="account_list_panel" className="h-full w-fit ml-[10%] mr-[10%]" onLoad={changeMargins}>
                    <Box sx={{width: '100%'}}>
                        <Box id="account_list_panel_box" className="flex justify-center w-[80vw]">
                            <Tabs value={value} onChange={(event, newValue) => {
                                setValue(newValue)
                            }} aria-label="" textColor="secondary" indicatorColor="secondary">
                                <Tab label="Watchlist" {...a11yProps(0)} sx={{color: '#FFFFFF', fontWeight: 800}}/>
                                <Tab label="Rated" {...a11yProps(1)} sx={{color: '#FFFFFF', fontWeight: 800}}/>
                                <Tab label="Lists" {...a11yProps(2)} sx={{color: '#FFFFFF', fontWeight: 800}}/>
                            </Tabs>
                        </Box>
                        <TabPanel value={value} index={0}>
                            <div className="whitespace-nowrap">
                                {watchlist.map((item, id) => {
                                    return (
                                        <div className="w-full h-[150px] sm:h-[150px] md:h-[250px] lg:h-[350px] mb-5 rounded-3xl flex border-2 border-[#FFFFFF] bg-[#2b2b2b]" key={id}>
                                            <img className="h-[146px] sm:h-[146px] md:h-[246px] lg:h-[346px] rounded-l-3xl" src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`} alt={item?.title}/>
                                            <div className="relative overflow-y-auto overflow-x-hidden text-xs sm:text-xs md:text-xl lg:text-2xl h-full">
                                                <div className="font-extrabold m-3 w-full text-left break-words">
                                                    <div className="flex">
                                                        <div className="relative">{item?.title}</div>
                                                        <div className="w-fit h-full relative mt-auto mb-auto ml-3">
                                                            <MdRemoveCircle className="w-fit h-fit" onClick={() => {removeItem(item).then(() => {})}}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="inline-block w-fit h-fit whitespace-pre-wrap mr-3 ml-3 text-left">{item?.overview}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <div className="whitespace-nowrap">
                                {ratedItems.map((item, id) => {
                                    return (
                                        <div className="w-full h-[150px] sm:h-[150px] md:h-[250px] lg:h-[350px] mb-5 rounded-3xl flex border-2 border-[#FFFFFF] bg-[#2b2b2b]" key={id}>
                                            <img className="h-[146px] sm:h-[146px] md:h-[246px] lg:h-[346px] rounded-l-3xl" src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`} alt={item?.title}/>
                                            <div className="relative overflow-y-auto overflow-x-hidden text-xs sm:text-xs md:text-xl lg:text-2xl h-full">
                                                <div className="m-3 mb-0 w-full text-left break-words">
                                                    <div className="flex font-extrabold">
                                                        <div className="relative">{item?.title}</div>
                                                    </div>
                                                    <div className="inline-block w-fit relative">
                                                        <div className="italic text-[#878787]">Your rating: {item?.rating}</div>
                                                    </div>
                                                </div>
                                                <div className="inline-block w-fit h-fit whitespace-pre-wrap mr-3 ml-3 text-left">{item?.overview}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <div className="whitespace-nowrap flex justify-center h-full w-full">
                                <div className="w-full h-[150px] sm:h-[150px] md:h-[250px] lg:h-[350px] mb-5 rounded-3xl flex border-2 border-[#FFFFFF] bg-[#2b2b2b]">
                                    <div className="relative overflow-y-auto overflow-x-hidden text-xs sm:text-xs md:text-xl lg:text-2xl h-full">
                                        <div className="m-3 mb-0 w-full text-left break-words">
                                            <div className="flex font-extrabold">
                                            </div>
                                            <div className="inline-block w-fit relative">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabPanel>
                    </Box>
                </div>
            </div>
        </Layout>
    )
}