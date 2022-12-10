import {Link, useHistory} from "react-router-dom";
import Logo from "../Icons/MyFavMovies-transparent.png";
import {MdAccountCircle, MdSearch, MdSettings} from "react-icons/md";
import React, {useState} from "react";
import AccountProtectedRoute from "./Account Route/AccountProtectedRoute";
import {screenSizeGroups} from "../Constants";
import Popover from '@mui/material/Popover';
import {signOut} from "firebase/auth";
import {auth} from "../firebase";

export default function Navbar() {
    const history = useHistory();
    const user = auth.currentUser;
    const [isMobileSized, setIsMobileSized] = useState(false);
    const [accountPopoverAnchorEl, setAccountPopoverAnchorEl] = React.useState(null);
    const isAccountPopoverOpen = Boolean(accountPopoverAnchorEl);
    const popoverId = isAccountPopoverOpen ? 'account-popover' : undefined;

    const logout = async () => {
        try {
            await signOut(auth);
            history.push('/');
        } catch (error) {
            console.log(error);
        }
    }

    window.addEventListener('resize', (() => handleMobileSize()));

    function handleMobileSize() {
        if (window.innerWidth < screenSizeGroups.twoItems && user) {
            const el = document.getElementById("logout_btn");
            if (el !== null) {
                el.style.visibility = "hidden";
                el.style.display = "none";
            }
            document.getElementById("navbar_settings").style.display = "none";
            document.getElementById("navbar_search").style.display = "none";
            document.getElementById("navbar_profile").style.width = "40px";
            document.getElementById("navbar_profile").style.marginRight = "-15px";
            setIsMobileSized(true);
        } else {
            handleAccountMenuClose();
            const el = document.getElementById("logout_btn");
            if (el !== null) {
                el.style.visibility = "visible";
                el.style.display = "block";
            }
            if (document.getElementById("navbar_settings")) document.getElementById("navbar_settings").style.display = "block";
            if (document.getElementById("navbar_search")) document.getElementById("navbar_search").style.display = "block";
            if (document.getElementById("navbar_profile")) document.getElementById("navbar_profile").style.width = "100px";
            if (document.getElementById("navbar_profile")) document.getElementById("navbar_profile").style.marginRight = "";
            setIsMobileSized(false);
        }
    }

    const handleAccountClick = (event) => {
        if (isMobileSized) {
            setAccountPopoverAnchorEl(event.currentTarget);
        } else {
            history.push("/account/");
        }
    };

    const handleAccountMenuClose = () => {
        setAccountPopoverAnchorEl(null);
    };

    return (<nav onLoad={handleMobileSize}>
        <div className="navbar">
            <div className="navbar_item">
                <Link to="/browse/"><img id="logo" src={Logo} alt="Home" width={25} height={25}/></Link>
            </div>
            <div className="navbar_item w-fit flex">
                {user?.email ? <div className="account flex_center relative h-[50px]">
                        <div id="navbar_search" className="navbar_item w-fit h-fit">
                            <Link to="/" className="navbar-btn"><MdSearch size={25}/></Link>
                        </div>
                        <div id="navbar_settings" className="navbar_item w-fit h-fit">
                            <Link to="/settings/"><AccountProtectedRoute><MdSettings size={25}/></AccountProtectedRoute></Link>
                        </div>
                        <div id="navbar_profile" className="w-[100px] h-fit rounded-full overflow-hidden" onClick={handleAccountClick}>
                            {user.photoURL ? <img src={user.photoURL} alt="Profile"/> :
                                <div className="w-[100px]">
                                    <MdAccountCircle size={40}/>
                                </div>
                            }
                        </div>
                        <button id={"logout_btn"} className="logout-btn button w-[120%] h-[80%]" onClick={logout}>Log Out</button>
                    </div> :
                    <div className="account flex_center relative w-fit h-[50px]">
                        <div id="navbar_search" className="navbar_item w-fit h-fit">
                            <Link to="/" className="navbar-btn"><MdSearch size={25}/></Link>
                        </div>
                        <div id="navbar_settings" className="navbar_item w-fit h-fit mr-[-10px]">
                            <Link to="/settings/"><AccountProtectedRoute><MdSettings size={25}/></AccountProtectedRoute></Link>
                        </div>
                        <Link to="/login/" className="logout-btn button w-[100%] h-[80%] relative"><button className="w-full h-full p-10 mt-[-38px] whitespace-nowrap">Sign In</button></Link>
                    </div>}
                <Popover id={popoverId} open={isAccountPopoverOpen} anchorEl={accountPopoverAnchorEl} onClose={handleAccountMenuClose} anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}>
                    <div className="w-full h-full p-3 text-black cursor-pointer" onClick={() => history.push("/account/")}>Account</div>
                    <div className="w-full h-full p-3 text-black cursor-pointer" onClick={() => history.push("/settings/")}>Settings</div>
                    <div className="w-full h-full p-3 text-black cursor-pointer" onClick={() => history.push("/search/")}>Search</div>
                </Popover>
            </div>
        </div>
    </nav>);
}