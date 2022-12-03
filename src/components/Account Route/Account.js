import Layout from "../Layout";
import {MdPerson} from "react-icons/md";
import React, {useEffect, useState} from "react"
import {Box, createTheme, Tab, Tabs, ThemeProvider, Typography} from "@mui/material";
import {collection, getDocs} from "firebase/firestore";
import {auth, db} from "../../firebase";
import {useHistory} from "react-router-dom";
import MovieListCard from "../MovieListCard";

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
    const user = auth.currentUser;
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

    function handleScreenResize() {
        changeMargins();
    }

    window.addEventListener('resize', handleScreenResize);

    useHistory().listen(() => {
        window.removeEventListener('resize', handleScreenResize);
    });

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
                            <ThemeProvider theme={createTheme({
                                palette: {
                                    secondary: {
                                        main: '#FFFFFF'
                                    }
                                }
                            })}>
                            <Tabs value={value} onChange={(event, newValue) => {
                                setValue(newValue)
                            }} aria-label="" textColor="secondary" indicatorColor={'secondary'} sx={{indicatorColor: '#FFFFFF', color: '#000000'}}>
                                <Tab label="Watchlist" {...a11yProps(0)} sx={{color: '#FFFFFF', fontWeight: 800}}/>
                                <Tab label="Rated" {...a11yProps(1)} sx={{color: '#FFFFFF', fontWeight: 800}}/>
                                <Tab label="Lists" {...a11yProps(2)} sx={{color: '#FFFFFF', fontWeight: 800}}/>
                            </Tabs>
                            </ThemeProvider>
                        </Box>
                        <TabPanel value={value} index={0}>
                            <div className="whitespace-nowrap">
                                {watchlist.map((item, id) => (<MovieListCard key={id} item={item} deleteButton={true} showRating={false}/>))}
                            </div>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <div className="whitespace-nowrap">
                                {ratedItems.map((item, id) => (<MovieListCard key={id} item={item} deleteButton={false} showRating={true}/>))}
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