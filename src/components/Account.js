import Layout from "./Layout";
import {UserAuth} from "../context/AuthContext";
import {useHistory} from "react-router-dom";
import {MdPerson, MdSettings} from "react-icons/md"
import React from "react"
import {Box, Tab, Tabs, Typography} from "@mui/material";

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
                    <Typography>{children}</Typography>
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
    console.log(user);
    const [value, setValue] = React.useState(0);

    document.onmousedown = () => {
        return true;
    };

    function settings() {
        history.push('/settings')
    }

    return (
        <Layout>
            <div className="flex h-screen">
                <div className="w-1/4 h-fit rounded-3xl border-r-2 border-b-2 border-r-[#fc686f] border-b-[#fc686f] flex profile_overview text-xs sm:text-xs md:text-2xl lg:text-4xl">
                    <div className="relative m-2 w-[5px] sm:w-[15px] md:w-[25px] lg:w-[30px]">
                        <MdSettings className="" size={50} color="#000000" onClick={settings}/>
                    </div>
                    <div className="flex justify-center">
                        <div className="h-fit aspect-square w-3/5 text-justify flex items-center justify-center rounded-full bg-gradient-to-r p-1 from-[#fe934c] to-[#fc686f]">
                            <div className="w-full h-full text-justify flex items-center justify-center rounded-full overflow-hidden">
                                {user.photoURL ? <img src={user.photoURL} alt="Invalid URl"/> : <MdPerson className="" size={500} color="#000000"/>}
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 mb-5 w-full">{user ? user.displayName : 'Username'}</div>
                </div>
                <div className="w-3/4 h-full">
                    <Box sx={{ width: '100%' }}>
                        <Box>
                            <Tabs value={value} onChange={(event, newValue) => {setValue(newValue)}} aria-label="" textColor="secondary" indicatorColor="secondary">
                                <Tab label="Watchlist" {...a11yProps(0)} sx={{color: '#FFFFFF', fontWeight: 800}}/>
                                <Tab label="Rated" {...a11yProps(1)} sx={{color: '#FFFFFF', fontWeight: 800}}/>
                                <Tab label="Lists" {...a11yProps(2)} sx={{color: '#FFFFFF', fontWeight: 800}}/>
                            </Tabs>
                        </Box>
                        <TabPanel value={value} index={0}>
                            <div className="whitespace-nowrap">
                                <div className="bg-gray-600 w-full h-[100px] sm:h-[150px] md:h-[250px] lg:h-[350px] mb-5">Movie</div>
                                <div className="bg-gray-600 w-full h-[100px] sm:h-[150px] md:h-[250px] lg:h-[350px] mb-5">Movie</div>
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