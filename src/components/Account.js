import Layout from "./Layout";
import {UserAuth} from "../context/AuthContext";
import {useHistory} from "react-router-dom";
import {MdPerson, MdRemoveCircle, MdSettings} from "react-icons/md"
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
    const history = useHistory();
    const [value, setValue] = React.useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [watchlist, setWatchlist] = useState([]);

    document.onmousedown = () => {
        return true;
    };

    function settings() {
        history.push('/settings')
    }

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                const querySnapshot = await getDocs(collection(db, "users", auth.currentUser.uid.toString(), "watchlist"));
                const items = [];
                querySnapshot.forEach((doc) => {
                    items.push(doc.data().item);
                });
                setWatchlist(items);
                console.log(watchlist);
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

    return (
        !isLoading && <Layout>
            <div className="flex h-screen">
                <div className="w-1/4 h-fit rounded-3xl border-r-2 border-b-2 border-r-[#fc686f] border-b-[#fc686f] flex profile_overview text-xs sm:text-xs md:text-2xl lg:text-4xl">
                    <div className="relative m-2 w-[15px] sm:w-[30px] md:w-[50px] lg:w-[60px] cursor-pointer">
                        <MdSettings className="w-fit" size={50} color="#FFFFFF" onClick={settings}/>
                    </div>
                    <div className="flex justify-center">
                        <div className="h-fit aspect-square w-3/5 text-justify flex items-center justify-center rounded-full bg-gradient-to-r p-1 from-[#fe934c] to-[#fc686f]">
                            <div className="w-full h-full text-justify flex items-center justify-center rounded-full overflow-hidden">
                                {user.photoURL ? <img src={user.photoURL} alt="Invalid URl"/> :
                                    <MdPerson className="" size={500} color="#000000"/>}
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 mb-5 w-full">{user ? user.displayName : 'Username'}</div>
                </div>
                <div className="w-3/4 h-full">
                    <Box sx={{width: '100%'}}>
                        <Box>
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
                                        <div className="w-full h-[100px] sm:h-[150px] md:h-[250px] lg:h-[350px] mb-5 rounded-3xl flex border-2 border-[#fc686f] bg-[#2b2b2b]" key={id}>
                                            <img className="h-[96px] sm:h-[146px] md:h-[246px] lg:h-[346px] rounded-l-3xl" src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`} alt={item?.title}/>
                                            <div className="relative overflow-y-auto overflow-x-hidden text-xs sm:text-xs md:text-xl lg:text-2xl h-full">
                                                <div className="font-extrabold m-3 w-full text-left break-words">
                                                    <div className="flex">
                                                        <div className="relative">{item?.title}</div>
                                                        <div className="w-full h-full relative mt-auto mb-auto ml-3">
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
                            <div>Rated Panel</div>
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <div>Lists Panel</div>
                        </TabPanel>
                    </Box>
                </div>
            </div>
        </Layout>
    )
}